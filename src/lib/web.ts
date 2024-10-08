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
export async function* fetchExternalUsfmAndCache(files: fetchExternalArgs) {
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
