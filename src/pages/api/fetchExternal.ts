export const prerender = false;
import type {Response as WorkerResponse} from "@cloudflare/workers-types";
import type {APIRoute} from "astro";

export const GET: APIRoute = async ({url, locals}) => {
  const queryParams = url.searchParams;
  const urlToFetch = queryParams.get("url");
  const hashParam = queryParams.get("hash");
  const runtime = locals.runtime;

  if (!urlToFetch) {
    return new Response(null, {
      status: 400,
    });
  }
  const decodedUrlToFetch = decodeURIComponent(urlToFetch);
  console.log(`fetching ${decodedUrlToFetch}with hash of ${hashParam}`);
  // In cloudflare, fetches on Get requests go through the caches.default, so we don't have to manually call caches.match for these
  const res = await fetch(decodedUrlToFetch);
  if (hashParam && res.ok) {
    runtime.ctx.waitUntil(
      (async () => {
        const headers = new Headers();
        // long cache control due to hash which are usually sha 256's of content
        headers.append(
          "Cache-Control",
          "public, max-age=31536000, s-maxage=31536000"
        );
        headers.append("Access-Control-Allow-Origin", "*");
        const resClone = res.clone();
        const newResToCache = new Response(resClone.body, {
          headers,
        }) as unknown as WorkerResponse;
        await runtime.caches.default.put(decodedUrlToFetch, newResToCache);
      })()
    );
  }
  return new Response(res.body, {
    headers: {
      ...res.headers,
      "Access-Control-Allow-Origin": "*",
    },
  });
};
