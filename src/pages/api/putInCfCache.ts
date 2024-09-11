export const prerender = false;
import type {APIRoute} from "astro";

export const POST: APIRoute = async ({request, url}) => {
  const cacheKey = url.searchParams.get("cacheKey");
  const routeToCache = url.searchParams.get("routeToCache");
  if (!globalThis.caches?.default || !request.body) {
    return new Response(null, {
      status: 500,
      statusText: "not production cache",
    });
  }
  if (!cacheKey || !routeToCache) {
    return new Response(null, {
      status: 400,
      statusText: "no cacheKey or routeToCache",
    });
  }
  switch (routeToCache) {
    case "resource-index":
      await cacheResourcesIndex({
        cacheKeyUrl: cacheKey,
        body: request.body,
      });
      return new Response(null, {
        status: 200,
        statusText: "success caching",
      });
    default:
      return new Response(null, {
        status: 400,
        statusText: "no cacheKey or routeToCache",
      });
  }
};

type cacheResourcesIndexArgs = {
  body: BodyInit;
  cacheKeyUrl: string;
};

async function cacheResourcesIndex({
  body,
  cacheKeyUrl,
}: cacheResourcesIndexArgs) {
  if (!globalThis.caches?.default) {
    console.log("no default cache");
    return;
  }
  const maxAge = 20;
  const oneYearInSeconds = 60 * 60 * 24 * 365;
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": `public, max-age=${maxAge}, s-maxage=${oneYearInSeconds}`,
  });
  const cacheKey = new Request(cacheKeyUrl, {
    method: "GET",
    headers: {"Content-Type": "application/json"},
  });

  await globalThis.caches.default.put(cacheKey, new Response(body, {headers}));
}
