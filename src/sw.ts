import type {ZipSrcBodyReq} from "@customTypes/types";
import {downloadZip, makeZip} from "client-zip";
import {clientsClaim} from "workbox-core";
import {cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import {registerRoute} from "workbox-routing";
import {CacheFirst} from "workbox-strategies";
import type {ghFile} from "./data/github";
import {
  bielExternalCacheName,
  fetchExternal,
  storeCloneInSwCache,
} from "./lib/web";
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
    if (request.url.includes("sw-proxy-zip")) {
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

      const stream = downloadZip(fetchExternal(asObj.payload.files));
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
  },
  "POST"
);

// Proxy TS files from github
registerRoute(
  ({request}) => {
    if (request.url.includes("sw-proxy-ts")) {
      return true;
    }
    return false;
  },
  async ({request, event}) => {
    const formData = await request.formData();
    const payload = formData.get("zipPayload");
    const asObj = JSON.parse(payload as string) as {
      payload: ghFile[];
      name: string;
    };

    const totalSize = String(
      // biome-ignore lint/suspicious/noAssignInExpressions: <easy to see how this reduce works>
      // biome-ignore lint/style/noParameterAssign: <easy to see how this reduce works>
      asObj.payload.reduce((acc, curr) => (acc += curr.size || 0), 0)
    );

    async function* fetchExternal() {
      for (const f of asObj.payload) {
        try {
          const res = await fetch(
            `/api/fetchExternal?url=${encodeURIComponent(f.url)}&hash=${f.sha}`
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
      console.error(error);
      // Just kick it back to the referrer
      return fetch(request.referrer);
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
      if (res?.ok) {
        return new Response(res.body, {
          headers: {
            "Content-Disposition": `attachment; filename='${name}'`,
            "Content-Type": "application/octet-stream",
          },
        });
      }
      throw new Error(res.statusText);
    } catch (e) {
      console.error(e);
      return new Response(null, {status: 404});
    }
  }
);

// Scripture app builder
// todo: shouldn't be in sw.. no way to stream back apk, and don't want to redirect back, but I could proxy them through cf and cache
registerRoute(
  ({request}) => {
    if (request.url.includes("sab-zip")) {
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
      langEnglishName: string;
    };
    if (asObj.payload.type === "gateway") {
      const res = await fetch(
        `${asObj.payload.files[0]!.url}/archive/master.zip`
      );
      const zipStream = makeZip([res]);
      const streamConsumed = new Response(zipStream);
      const blob = await streamConsumed.blob();
      const remoteUrl = "todo";
      // return fetch(`${asObj.payload.files[0]!.url}/archive/master.zip`);
    }
    try {
      const totalSize = String(
        // biome-ignore lint/suspicious/noAssignInExpressions: <easy to see how this reduce works>
        // biome-ignore lint/style/noParameterAssign: <easy to see how this reduce works>
        asObj.payload.files.reduce((acc, curr) => (acc += curr.size || 0), 0)
      );

      // todo: abstract this duplicated logic from other function

      const stream = makeZip(fetchExternal(asObj.payload.files));
      // Easier than manually reading the stream to completion
      const tempResponse = new Response(stream);
      const blob = await tempResponse.blob();
      const blobAsFile = new File([blob], asObj.name);
      const formData = new FormData();
      formData.append("sourceZip", blobAsFile);
      formData.append("sourceZipName", asObj.name);
      // upload the heart to r2:
      // todo: env var
      // const res = await fetch("http://localhost:8787", {
      //   method: "POST",
      //   body: formData,
      // });
      const workerUrl =
        "https://sab-zips.wycliffe-associates-account.workers.dev/";
      const res = await fetch(workerUrl, {
        method: "POST",
        body: formData,
      });
      // todo: env var
      const zipUrl = `https://pub-9bb68f4e87184c649fe84627789c5069.r2.dev/${asObj.name}/archive/master.zip`;

      // todo: need to get phone from payload
      const phone = "6624360532";
      // todo env var
      // let sabUrl = `https://scriptureappbuilderapi-win.azurewebsites.net/api/triggerbuild`;
      // let searchParams = new URLSearchParams({
      //   repoUrl: `${zipUrl}`,
      //   Phone: "6624360532",
      //   appName: `${asObj.langEnglishName} Bible`,
      // });
      // sabUrl = sabUrl.concat(`?${searchParams.toString()}`);

      const sabRes = await fetch(`/api/proxySab`, {
        method: "POST",
        body: JSON.stringify({
          sabUrl:
            "https://scriptureappbuilderapi-win.azurewebsites.net/api/triggerbuild",
          payload: {
            repoURL: `${zipUrl}`,
            Phone: "6624360532",
            // appName: `${asObj.langEnglishName} Bible`,
            appName: `a1acholi`,
          },
        }),
      });
      const sabData = await sabRes.json();
      console.log(sabData);

      // todo: send to SAB
      return new Response(null, {
        status: 200,
      });
      // return new Response(stream.body, {
      //   headers: {
      //     "Content-Disposition": `attachment; filename="${encodeURI(
      //       asObj.name
      //     )}.zip"`,
      //     "Content-Length": totalSize,
      //     "Content-Type": "application/octet-stream",
      //   },
      // });
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
    return request.url.includes("/api/fetchExternal") && hashParam;
  },
  // Hashes should guarantee strong caching that doesn't need expiring, so go cache first on those, but route through CF as well
  new CacheFirst({
    cacheName: bielExternalCacheName,
    fetchOptions: {},
  })
);
