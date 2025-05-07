export const prerender = false;
import type { Response as WorkerResponse } from "@cloudflare/workers-types";
import {
	ATagHandler,
	ImgTagRemover,
	SpanifyDeadALinks,
	type handlerTypes,
} from "@src/lib/htmlRewriter";
import type { APIRoute } from "astro";
import { HTMLRewriter } from "htmlrewriter";
export const GET: APIRoute = async ({ request, url, locals }) => {
	const queryParams = url.searchParams;
	const urlToFetch = queryParams.get("url");
	const hashParam = queryParams.get("hash");
	const rewrite = queryParams.get("rewrite") || false;
	const resourceType = queryParams.get("resource-type");
	const cacheBypass = queryParams.get("no-cache");
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
	// only check cf cache if we don't want to bypass
	const cachedVal = cacheBypass
		? undefined
		: await runtime.caches.default.match(urlToFetch);
	if (cachedVal) {
		if (rewrite) {
			return rewriteResponseIfNeeded({
				resourceType: resourceType || "DEFAULT",
				response: cachedVal as unknown as Response,
				responseHeaders: cachedVal.headers as unknown as Headers,
			});
		}
		return cachedVal as unknown as Response;
	}

	const res = await fetch(encodeURI(urlToFetch), {
		headers: reqHeadersCopy,
	});
	// must have hash, must have fetched ok, and must be ok or unchanged header status
	if (hashParam && res.ok && ["200", "304"].includes(res.status.toString())) {
		runtime.ctx.waitUntil(
			(async () => {
				const headers = new Headers();
				// long cache control due to hash which are usually sha 256's of content
				headers.append(
					"cache-control",
					"public, max-age=31536000, s-maxage=31536000",
				);
				headers.append("Access-Control-Allow-Origin", "*");
				const resClone = res.clone();
				const resBytes = await resClone.bytes();
				if (!resBytes || resBytes.length === 0) {
					// return, somehow we got an empty body back adn don't want that cached;
					return;
				}
				headers.append("Content-Length", resBytes.length.toString());
				const newResToCache = new Response(resBytes, {
					headers,
				}) as unknown as WorkerResponse;
				await runtime.caches.default.put(urlToFetch, newResToCache);
			})(),
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
	if (rewrite) {
		return rewriteResponseIfNeeded({
			resourceType: resourceType || "DEFAULT",
			response: res,
			responseHeaders: resHeaders,
		});
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		return new Response(res.body, { headers: resHeaders });
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
		.transform(new Response(response.body, { headers: responseHeaders }));
}
