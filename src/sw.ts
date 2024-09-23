/// <reference lib="webworker" />
import {precacheAndRoute, cleanupOutdatedCaches} from "workbox-precaching";
import {registerRoute} from "workbox-routing";
import {clientsClaim} from "workbox-core";
import {CacheFirst} from "workbox-strategies";
import type {zipSrcBodyReq} from "@customTypes/types";
import {downloadZip} from "client-zip";
import type {ghFile} from "./data/github";
declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
self.__WB_DISABLE_DEV_LOGS = true;
clientsClaim();
cleanupOutdatedCaches();

const manifest = self.__WB_MANIFEST;
console.log({manifest});
import.meta.env.PROD && precacheAndRoute(manifest);
const bielExternalCacheName = "biel-external";
registerRoute(
  ({request}) => {
    if (request.url.includes("sw-proxy-zip")) {
      return true;
    }
  },
  async ({request}) => {
    const formData = await request.formData();
    let payload = formData.get("zipPayload");
    const asObj = JSON.parse(payload as string) as {
      payload: zipSrcBodyReq;
      redirectTo: string;
      name: string;
    };
    if (asObj.payload.type == "gateway") {
      return fetch(`${asObj.payload.files[0]!.url}/archive/master.zip`);
    } else {
      try {
        const totalSize = String(
          asObj.payload.files.reduce((acc, curr) => (acc += curr.size || 0), 0)
        );

        async function storeCloneInSwCache(
          response: Response,
          cacheKey: string
        ) {
          const cache = await caches.open(bielExternalCacheName);
          await cache.put(cacheKey, response.clone());
        }
        async function* fetchExternal() {
          for (const f of asObj.payload.files) {
            try {
              const url = `/api/fetchExternal?url=${f.url}?hash=${f.hash}`;
              const splitOnSlashes = f.url.split("/");
              const nextToLast = splitOnSlashes[splitOnSlashes.length - 2];
              const cacheMatch = await caches.match(url, {
                cacheName: bielExternalCacheName,
              });
              if (cacheMatch) {
                console.log("cacheMatch", cacheMatch);
                yield {
                  name:
                    `${nextToLast}.usfm` ||
                    `biel-download-${Math.random()}.usfm`,
                  input: cacheMatch,
                };
              } else {
                const res = await fetch(url);
                const clone = res.clone();
                if (res.ok) {
                  // store a local copy with the hash
                  storeCloneInSwCache(clone, url);
                }
                yield {
                  name:
                    `${nextToLast}.usfm` ||
                    `biel-download-${Math.random()}.usfm`,
                  input: res,
                };
              }
            } catch (error) {
              console.error(error);
              yield {
                name: `${f.url}.usfm` || `biel-download-${Math.random()}.usfm`,
                input: new Response(null, {
                  status: 404,
                }),
              };
            }
          }
        }
        const stream = downloadZip(fetchExternal());
        return new Response(stream.body, {
          headers: {
            "Content-Disposition": `attachment; filename="${encodeURI(
              asObj.name
            )}.zip"`,
            "Content-Length": totalSize,
            "Content-Type": "application/octet-stream",
          },
        });
      } catch (e) {
        console.error(e);
        return fetch(asObj.redirectTo);
      }
    }
  },
  "POST"
);

// Proxy TS files from github
registerRoute(
  ({request}) => {
    if (request.url.includes("ts-zip-files")) {
      return true;
    }
  },
  async ({request}) => {
    const formData = await request.formData();
    let payload = formData.get("zipPayload");
    const asObj = JSON.parse(payload as string) as {
      payload: ghFile[];
      name: string;
    };

    const totalSize = String(
      asObj.payload.reduce((acc, curr) => (acc += curr.size || 0), 0)
    );

    // async function storeCloneInSwCache(response: Response, cacheKey: string) {
    //   const cache = await caches.open(bielExternalCacheName);
    //   await cache.put(cacheKey, response.clone());
    // }
    async function* fetchExternal() {
      for (const f of asObj.payload) {
        try {
          const res = await fetch(
            `/api/fetchExternal?url=${f.url}&hash=${f.sha}`
          );
          yield {
            name: `${f.path}`,
            input: res,
          };
        } catch (error) {
          console.error(error);
          yield {
            name: null,
            input: new Response(null, {
              status: 404,
            }),
          };
        }
      }
    }
    try {
      const stream = downloadZip(fetchExternal());
      return new Response(stream.body, {
        headers: {
          "Content-Disposition": `attachment; filename="${encodeURI(
            asObj.name
          )}.zip"`,
          "Content-Length": totalSize,
          "Content-Type": "application/octet-stream",
        },
      });
    } catch (error) {
      // todo: fix this error handling
      return fetch("");
    }
  },
  "POST"
);

// PROXY DOC THROUGH SW TO DOWNlOAD
registerRoute(
  ({url}) => {
    const urlObj = new URL(url);
    const docQueryParam = urlObj.searchParams.get("doc-url");
    if (url.href.includes("doc-download") && docQueryParam) {
      return true;
    }
  },
  async ({url}) => {
    const docQueryParam = url.searchParams.get("doc-url");
    const name = url.searchParams.get("name") || "biel-download";
    if (!docQueryParam) return new Response(null, {status: 404});
    try {
      const res = await fetch(docQueryParam);
      if (res && res.ok) {
        return new Response(res.body, {
          headers: {
            "Content-Disposition": `attachment; filename='${name}'`,
            "Content-Type": "application/octet-stream",
          },
        });
      } else {
        throw new Error(res.statusText);
      }
    } catch (e) {
      console.error(e);
      return new Response(null, {status: 404});
    }
  }
);

registerRoute(
  ({url, request}) => {
    const urlObj = new URL(url);
    const hashParam = urlObj.searchParams.get("hash");
    return request.url.includes("/api/fetchExternal") && hashParam;
  },
  // Hash should guarantee strong caching that doesn't need expiring
  new CacheFirst({
    cacheName: bielExternalCacheName,
    fetchOptions: {},
  })
);
