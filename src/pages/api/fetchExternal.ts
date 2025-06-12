export const prerender = false;
import type {Response as WorkerResponse} from "@cloudflare/workers-types";
import {CustomXCacheTagHeader} from "@lib/constants";
import {
  ATagHandler,
  ImgTagRemover,
  SpanifyDeadALinks,
  type handlerTypes,
} from "@src/lib/htmlRewriter";
import type {APIRoute} from "astro";
import {HTMLRewriter} from "htmlrewriter";
export const GET: APIRoute = async ({request, url, locals}) => {
  const queryParams = url.searchParams;
  const urlToFetch = queryParams.get("url");
  const hashParam = queryParams.get("hash");
  const rewrite = queryParams.get("rewrite") || false;
  const resourceType = queryParams.get("resource-type");
  const cacheBypass = queryParams.get("no-cache");
  const cacheTagHeader = request.headers.get(CustomXCacheTagHeader);

  // copy the params, but get rid of the url and no-cache to create a cacheable url of type url?hash=HASH&rewrite=rewrite&resource-type=resource-type
  const relevantParams = new URLSearchParams();
  relevantParams.delete("url");
  relevantParams.delete("no-cache");
  relevantParams.delete("rewrite");
  const urlWithRelevantQueryParameters = `${urlToFetch}?${relevantParams.toString()}`;

  const runtime = locals.runtime;

  if (!urlToFetch) {
    return new Response(null, {
      status: 400,
    });
  }
  // In cloudflare, fetches on Get requests go through the caches.default, so we don't have to manually call caches.match for these
  const reqHeaders = request.headers;
  const reqHeadersCopy = new Headers(reqHeaders);
  reqHeadersCopy.set("user-agent", "biel-website");
  const reqToMakeWithUaSet = new Request(urlWithRelevantQueryParameters, {
    headers: reqHeadersCopy,
  });
  // only check cf cache if we don't want to bypass
  const cachedVal = cacheBypass
    ? undefined
    : // cache match includes the hasf of url?hash=HASH&other-params, but external fetch won't pass these along.
      await runtime.caches.default.match(reqToMakeWithUaSet.url);
  const cachedValIsCfChallenge = cachedVal
    ? await isCfChallengeRes({
        res: cachedVal as unknown as WorkerResponse,
      })
    : false;
  if (cachedValIsCfChallenge) {
    // delete cloudflare challenges as out of band work.
    runtime.ctx.waitUntil(
      runtime.caches.default.delete(reqToMakeWithUaSet.url)
    );
  }
  if (cachedVal && !cachedValIsCfChallenge) {
    // if we have a cached value, and it's not a cf challenge, return it
    console.log(
      `found in cache ${reqToMakeWithUaSet.url} for request url ${urlToFetch}`
    );
    if (rewrite) {
      return rewriteResponseIfNeeded({
        resourceType: resourceType || "DEFAULT",
        response: cachedVal as unknown as Response,
        responseHeaders: cachedVal.headers as unknown as Headers,
      });
    }
    return cachedVal as unknown as Response;
  }

  // not in cache must fetch: Only fetch url to external, don't pass along biel specific query params
  const res = await fetch(encodeURI(urlToFetch), {
    headers: reqHeadersCopy,
  });
  if (res.headers.get("cf-mitigated") === "challenge") {
    // This response was a cloudflare challenge, so we just need to bail:
    return new Response(null, {
      status: 503,
      statusText: "Cloudflare Challenge Detected",
    });
  }
  // must have hash, must have fetched ok, and must be ok or unchanged header status
  if (hashParam && res.ok && ["200", "304"].includes(res.status.toString())) {
    runtime.ctx.waitUntil(
      (async () => {
        const headers = new Headers();
        // long cache control due to hash which are usually sha 256's of content
        headers.append("cache-control", "public, s-maxage=31536000");
        headers.append("Access-Control-Allow-Origin", "*");
        const resClone = res.clone();
        const resBytes = await resClone.bytes();
        let asText: string | null = null;
        try {
          asText = new TextDecoder("utf-8").decode(resBytes);
        } catch (e) {
          console.error(e);
          return;
        }
        if (
          !resBytes ||
          resBytes.length === 0 ||
          asText?.includes("challenge-error-text")
        ) {
          // return, somehow we got an empty body back adn don't want that cached or we got a cf challenge
          console.error(`got empty body or cf challenge for ${urlToFetch}`);
          return;
        }
        headers.append("Content-Length", resBytes.length.toString());
        if (cacheTagHeader) {
          headers.append("Cache-Tag", cacheTagHeader);
        }
        const newResToCache = new Response(resBytes, {
          headers,
        }) as unknown as WorkerResponse;
        // cache the url with the relevant query params
        console.log(`putting in cache ${reqToMakeWithUaSet.url}`);
        await runtime.caches.default.put(reqToMakeWithUaSet.url, newResToCache);
      })()
    );
  }

  // const originalHeaders: Record<string, string> = {};
  const contentLength = res.headers.get("Content-length");
  const resHeaders = new Headers({
    "Access-Control-Allow-Origin": "*",
  });
  if (cacheTagHeader) {
    resHeaders.append("Cache-Tag", cacheTagHeader);
  }
  if (contentLength) {
    resHeaders.set("Content-Length", contentLength);
  }
  if (rewrite) {
    return rewriteResponseIfNeeded({
      resourceType: resourceType || "DEFAULT",
      response: res,
      responseHeaders: resHeaders,
    });
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    return new Response(res.body, {headers: resHeaders});
  }
};

type RewriteResponseIfNeededArgs = {
  resourceType: string;
  response: Response;
  responseHeaders: Headers;
};
function rewriteResponseIfNeeded({
  resourceType,
  response,
  responseHeaders,
}: RewriteResponseIfNeededArgs) {
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
    .transform(new Response(response.body, {headers: responseHeaders}));
}

type IsCfChallengeResArgs = {
  res: WorkerResponse;
};
async function isCfChallengeRes({res}: IsCfChallengeResArgs): Promise<boolean> {
  // don't deal with res main fxn might still be using
  const clone = res.clone();
  const resBytes = await clone.bytes();
  let asText: string | null = null;
  try {
    asText = new TextDecoder("utf-8").decode(resBytes);
  } catch (e) {
    console.error(e);
    return false; // if we can't decode as text, assume ok
  }
  if (
    !resBytes ||
    resBytes.length === 0 ||
    asText?.includes("challenge-error-text")
  ) {
    return true;
  }

  if (res.headers.get("cf-mitigated") === "challenge") {
    return true;
  }

  return false;
}
