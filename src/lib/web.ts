import type {ZipSrcBodyReq} from "@customTypes/types";
import {makeZip} from "client-zip";

export const bielExternalCacheName = "biel-external";

export function isAbsoluteUrl(str: string) {
  const isAbsoluteRegex = /^(?:[a-z+]+:)?\/\//i;
  return isAbsoluteRegex.test(str);
}
export function blocksAreEmpty<T>(blocks: T[]) {
  return blocks.length === 0;
}

type fetchExternalArgs = Array<{
  url: string;
  hash: string | null;
  size: number | null;
}>;
export async function* fetchExternal(files: fetchExternalArgs) {
  for (const f of files) {
    try {
      const url = `/api/fetchExternal?url=${encodeURIComponent(f.url)}&hash=${
        f.hash
      }`;
      const splitOnSlashes = f.url.split("/");
      const nextToLast = splitOnSlashes[splitOnSlashes.length - 2];
      const cacheMatch = await caches.match(url, {
        cacheName: bielExternalCacheName,
      });
      if (cacheMatch) {
        yield {
          name: `${nextToLast}.usfm` || `biel-download-${Math.random()}.usfm`,
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
          name: `${nextToLast}.usfm` || `biel-download-${Math.random()}.usfm`,
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

export async function storeCloneInSwCache(
  response: Response,
  cacheKey: string
) {
  const cache = await caches.open(bielExternalCacheName);
  await cache.put(cacheKey, response.clone());
}

type startScriptureAppBuilderArgs = {
  payload: ZipSrcBodyReq;
  ietfCode: string;
  langEnglishName: string;
};
export async function startScriptureAppBuilder({
  payload,
  ietfCode,
  langEnglishName,
}: startScriptureAppBuilderArgs) {
  if (payload.type === "gateway") {
    // single file for gateway
    const zipRes = await fetch(`${payload.files[0]!.url}/archive/master.zip`);
    const bl = await zipRes.blob();
    console.log(bl.size);
    console.log(zipRes);
    console.log(Object.entries(zipRes.headers));
    // todo rest of gateway
    return;
  } else {
    const allHashes = payload.files.map((f) => f.hash).join("");
    const hashOfHashes = await digestMessage(allHashes);
    const stream = makeZip(fetchExternal(payload.files));
    // Need to consume all the bytes of stream to send across the wire. Easiest way is to consume that stream is just create a new response and await a
    const tempResponse = new Response(stream);
    // Can you just send an arrayBuffer as formdata?
    const blob = await tempResponse.blob();
    // const blobHash = await hashBlob(blob);
    const appName = `${ietfCode}-${hashOfHashes}`;
    // const blobAsFile = new File([blob], appName);
    // need zipData, appName, ietfCode
    const formData = new FormData();
    formData.append("zipData", blob);
    formData.append("appName", appName);
    formData.append("ietfCode", ietfCode);
    formData.append("appDisplayName", `${langEnglishName} Bible`);
    const apkUrl = "http://localhost:3000";
    console.log("sending requesut to make apk");
    const res = await fetch(apkUrl, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const apkBlob = await res.blob();
      return apkBlob;
    }
  }
}

async function hashBlob(blob: Blob) {
  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    await blob.arrayBuffer()
  ); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
