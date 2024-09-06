/// <reference lib="webworker" />
import {precacheAndRoute, cleanupOutdatedCaches} from "workbox-precaching";
import {registerRoute} from "workbox-routing";
import {clientsClaim} from "workbox-core";
import {CacheFirst} from "workbox-strategies";
import type {zipSrcBodyReq} from "@customTypes/types";
import {downloadZip} from "client-zip";
declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
self.__WB_DISABLE_DEV_LOGS = true;
clientsClaim();
cleanupOutdatedCaches();

// todo: flesh out.. Probs need to be a fetch wall to wpml on build and write out to a a file. and import here.
const resourcePageSlugs = ["resources", "ressources", "recursos"];

import.meta.env.PROD && precacheAndRoute(self.__WB_MANIFEST);
const bielExternalCacheName = "biel-external";
registerRoute(
  ({request, sameOrigin, event}) => {
    if (request.url.includes("sw-proxy-zip")) {
      return true;
    }
  },
  async ({url, request, event, params}) => {
    console.log(url, request, event, params);
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
      // todo: abort zip.js. Use client-zip.  Use a generator. Return the writable stream.
      const totalSize = String(
        asObj.payload.files.reduce((acc, curr) => (acc += curr.size || 0), 0)
      );

      async function storeCloneInSwCache(response: Response, cacheKey: string) {
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
                  `${nextToLast}.usfm` || `biel-download-${Math.random()}.usfm`,
                input: cacheMatch,
              };
            } else {
              console.log("fetchign from origin");
              const res = await fetch(url);
              const clone = res.clone();
              if (res.ok) {
                // store a local copy with the hash
                storeCloneInSwCache(clone, url);
              }
              yield {
                name:
                  `${nextToLast}.usfm` || `biel-download-${Math.random()}.usfm`,
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
      console.log(asObj.name);
      return new Response(stream.body, {
        headers: {
          "Content-Disposition": `attachment; filename="${encodeURI(
            asObj.name
          )}.zip"`,
          "Content-Length": totalSize,
          "Content-Type": "application/octet-stream",
        },
      });
    }
  },
  "POST"
);

// PROXY DOC THROUGH SW TO DOWNlOAD
registerRoute(
  ({url, request}) => {
    const urlObj = new URL(url);
    const docQueryParam = urlObj.searchParams.get("doc-url");
    if (url.href.includes("doc-download") && docQueryParam) {
      return true;
    }
  },
  async ({url}) => {
    const docQueryParam = url.searchParams.get("doc-url");
    const name = url.searchParams.get("name") || "biel-download";
    console.log("doc-url", docQueryParam);
    console.log("name", name);
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

// todo... "localized" routes will probably need to come via wpml:
registerRoute(
  ({url, request}) => {
    const urlObj = new URL(url);
    const hashParam = urlObj.searchParams.get("hash");
    return request.url.includes("/api/fetchExternal") && hashParam;
  },
  new CacheFirst({
    cacheName: bielExternalCacheName,
    fetchOptions: {},
  })
);
