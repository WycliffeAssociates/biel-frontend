export const prerender = false;
import type {Response as WorkerResponse} from "@cloudflare/workers-types";
import type {APIRoute} from "astro";

export const POST: APIRoute = async ({url, locals, request}) => {
  const body = await request.json();
  const runtime = locals.runtime;

  if (!body || !("payload" in body) || !("sabUrl" in body)) {
    return new Response(null, {
      status: 400,
      statusText: "bad request",
    });
  }
  const {payload, sabUrl} = body;
  const searchParams = new URLSearchParams(Object.entries(payload));
  const sabUrlWithQuery = `${sabUrl}?${searchParams.toString()}`;

  console.log(`fetching ${sabUrlWithQuery}`);
  // In cloudflare, fetches on Get requests go through the caches.default, so we don't have to manually call caches.match for these
  const res = await fetch(sabUrlWithQuery);
  // todo: decide on caching at cf level alter
  // if (hashParam && res.ok) {
  //   runtime.ctx.waitUntil(
  //     (async () => {
  //       const headers = new Headers();
  //       // long cache control due to hash which are usually sha 256's of content
  //       headers.append(
  //         "Cache-Control",
  //         "public, max-age=31536000, s-maxage=31536000"
  //       );
  //       headers.append("Access-Control-Allow-Origin", "*");
  //       const resClone = res.clone();
  //       const newResToCache = new Response(resClone.body, {
  //         headers,
  //       }) as unknown as WorkerResponse;
  //       await runtime.caches.default.put(decodedUrlToFetch, newResToCache);
  //     })()
  //   );
  // }
  return new Response(res.body, {
    headers: {
      ...res.headers,
      "Access-Control-Allow-Origin": "*",
    },
  });
};
