import type {ZipSrcBodyReq} from "@customTypes/types";
import {downloadZip, makeZip} from "client-zip";
import {clientsClaim} from "workbox-core";
import {cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import {registerRoute} from "workbox-routing";
import {CacheFirst} from "workbox-strategies";
import {bielExternalCacheName, fetchExternalUsfmAndCache} from "./lib/web";
import {constants} from "./lib/constants";
declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
self.__WB_DISABLE_DEV_LOGS = true;
clientsClaim();
cleanupOutdatedCaches();

const manifest = self.__WB_MANIFEST;
console.log({manifest});
import.meta.env.PROD && precacheAndRoute(manifest);

registerRoute(
  ({request}) => {
    if (request.url.includes(constants.swProxyZipsFormAction)) {
      return true;
    }
  },
  async ({request}) => {
    const formData = await request.formData();
    const payload = formData.get("zipPayload");
    const asObj = JSON.parse(payload as string) as {
      payload: ZipSrcBodyReq;
      redirectTo: string;
      name: string;
    };
    if (asObj.payload.type === "gateway") {
      return fetch(`${asObj.payload.files[0]!.url}/archive/master.zip`);
    }
    try {
      const totalSize = String(
        // biome-ignore lint/suspicious/noAssignInExpressions: <easy to see how this reduce works>
        // biome-ignore lint/style/noParameterAssign: <easy to see how this reduce works>
        asObj.payload.files.reduce((acc, curr) => (acc += curr.size || 0), 0)
      );

      const stream = downloadZip(
        fetchExternalUsfmAndCache(asObj.payload.files)
      );
      return new Response(stream.body, {
        headers: {
          "Content-Disposition": `attachment; filename="${encodeURI(
            asObj.name
          )}.zip"`,
          "Content-Length": totalSize,
          "Content-Type": constants.headerOctectStream,
        },
      });
    } catch (e) {
      console.error(e);
      return fetch(asObj.redirectTo);
    }
  },
  "POST"
);

registerRoute(
  ({url, request}) => {
    const urlObj = new URL(url);
    const hashParam = urlObj.searchParams.get("hash");
    return request.url.includes(constants.apiFetchExternal) && hashParam;
  },
  // Hashes should guarantee strong caching that doesn't need expiring, so go cache first on those, but route through CF as well
  new CacheFirst({
    cacheName: bielExternalCacheName,
    fetchOptions: {},
  })
);

registerRoute(
  ({url, sameOrigin}) => {
    // and unfortunate hack needing in case a firefox download since it'll kill a stream feeding a download if it takes too long
    return sameOrigin && url.pathname.includes(constants.swKeepAlive);
  },
  // Hashes should guarantee strong caching that doesn't need expiring, so go cache first on those, but route through CF as well
  async () => {
    // noop response for types
    return new Response(null, {
      status: 200,
    });
  },
  "POST"
);
