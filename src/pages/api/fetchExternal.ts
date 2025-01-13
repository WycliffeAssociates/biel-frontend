export const prerender = false;
import type {Response as WorkerResponse} from "@cloudflare/workers-types";
import type {APIRoute} from "astro";
import {HTMLRewriter} from "htmlrewriter";
import {
  ATagHandler,
  ImgTagRemover,
  SpanifyDeadALinks,
  type handlerTypes,
} from "@src/lib/htmlRewriter";
export const GET: APIRoute = async ({url, locals}) => {
  const queryParams = url.searchParams;
  const urlToFetch = queryParams.get("url");
  const hashParam = queryParams.get("hash");
  const resourceType = queryParams.get("resource-type");
  const runtime = locals.runtime;
  // console.log({urlToFetch, hashParam});

  if (!urlToFetch) {
    return new Response(null, {
      status: 400,
    });
  }
  const decodedUrlToFetch = decodeURIComponent(urlToFetch);

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

  // const originalHeaders: Record<string, string> = {};
  const contentLength = res.headers.get("Content-length");
  const resHeaders = new Headers({
    "Access-Control-Allow-Origin": "*",
  });
  if (contentLength) {
    resHeaders.set("Content-Length", contentLength);
  }
  const resourceTypeContext = resourceType || "DEFAULT";
  const rewriter = new HTMLRewriter();
  const aHandler = new ATagHandler(resourceTypeContext as handlerTypes);
  const imgHandler = new ImgTagRemover();
  const deadLinkHandler = new SpanifyDeadALinks();

  return rewriter
    .on("a[data-is-rc-link]", aHandler)
    .on("a[href*='html']", aHandler)
    .on("a[href^='rc://']", deadLinkHandler)
    .on("img[src*='content.bibletranslationtools.org'", imgHandler)
    .transform(new Response(res.body, {headers: resHeaders}));
  // return new Response(res.body, {
  //   headers: resHeaders,
  // });
};
