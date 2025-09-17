import type { ZipSrcBodyReq } from "@customTypes/types";
import { downloadZip } from "client-zip";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, NetworkFirst } from "workbox-strategies";
import { CacheTags, CustomXCacheTagHeader, constants } from "./lib/constants";
import {
	bielExternalCacheName,
	bielPagefindCacheName,
	bielStaticCacheName,
	fetchExternalUsfmAndCache,
} from "./lib/web";

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting();
self.__WB_DISABLE_DEV_LOGS = true;
clientsClaim();
cleanupOutdatedCaches();

const manifest = self.__WB_MANIFEST;
console.log({ manifest });
import.meta.env.PROD && precacheAndRoute(manifest);

const cacheablePlugin = new CacheableResponsePlugin({
	statuses: [0, 200, 304],
});

registerRoute(
	({ request }) => {
		if (request.url.includes(constants.swProxyZipsFormAction)) {
			return true;
		}
	},
	async ({ request }) => {
		const formData = await request.formData();
		const payload = formData.get("zipPayload");
		const asObj = JSON.parse(payload as string) as {
			payload: ZipSrcBodyReq;
			redirectTo: string;
			name: string;
		};
		if (asObj.payload.type === "gateway") {
			const urlPrefix = asObj.payload.files[0]!.url;
			const proxiedThroughServerUrl = `${location.origin}${
				constants.apiFetchExternal
			}?url=${encodeURIComponent(
				`${urlPrefix}/archive/master.zip`,
			)}&no-cache=1`;
			try {
				return fetch(`${proxiedThroughServerUrl}`, {
					method: "GET",
					headers: {
						"x-requested-with": "WA-Tool-Biel-SW",
						[CustomXCacheTagHeader]: `${CacheTags.zipArchives}`,
						"Content-Disposition": `attachment; filename="${encodeURI(
							asObj.name,
						)}.zip"`,
						"Content-Type": constants.headerOctectStream,
					},
				});
			} catch (e) {
				console.error(e);
				return fetch(asObj.redirectTo);
			}
		}
		try {
			const totalSize = String(
				// biome-ignore lint/suspicious/noAssignInExpressions: <easy to see how this reduce works>
				asObj.payload.files.reduce((acc, curr) => (acc += curr.size || 0), 0),
			);

			const stream = downloadZip(
				fetchExternalUsfmAndCache(asObj.payload.files),
			);
			return new Response(stream.body, {
				headers: {
					"Content-Disposition": `attachment; filename="${encodeURI(
						asObj.name,
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
	"POST",
);

// Handle cache bust reqeust for fetchExternal Calls:
registerRoute(
	({ url, request }) => {
		return (
			request.url.includes(constants.apiFetchExternal) &&
			(url.searchParams.has("cache-bust") || url.searchParams.has("no-cache"))
		);
	},
	async ({ request, url, event }) => {
		const cleanUrl = new URL(url.toString());
		cleanUrl.searchParams.delete("cache-bust");
		cleanUrl.searchParams.delete("no-cache");

		const response = await fetch(request);

		// Use the plugin to check if the response is cacheable
		const isCacheable = await cacheablePlugin.cacheWillUpdate?.({
			event,
			request,
			response,
			state: {},
		});
		const clone = response.clone();
		if (isCacheable) {
			const cache = await caches.open(bielExternalCacheName);
			// don't block returning response
			event.waitUntil(cache.put(cleanUrl.toString(), clone));
		}
		return response;
	},
	"GET",
);

registerRoute(
	({ url, request }) => {
		const urlObj = new URL(url);
		const hashParam = urlObj.searchParams.get("hash");
		return request.url.includes(constants.apiFetchExternal) && hashParam;
	},
	// Hashes should guarantee strong caching that doesn't need expiring, so go cache first on those, but route through CF as well
	new CacheFirst({
		cacheName: bielExternalCacheName,
		fetchOptions: {},
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200, 304],
			}),
		],
	}),
);

registerRoute(
	({ url, sameOrigin }) => {
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
	"POST",
);

registerRoute(
	({ sameOrigin, request }) => {
		// https://developer.mozilla.org/en-US/docs/Web/API/Request/destination#font
		const destination = request.destination;
		// todo: debug if this is caching images or not. It seems like it's not caching the webps for some reason
		const sameOriginCache = ["script", "style"];
		const anyOriginCache = ["image", "font"];
		const isFavicon = request.url.includes("favicon.svg");
		const isSvg = request.url.endsWith(".svg");

		if (sameOrigin) {
			return sameOriginCache.includes(destination) || isFavicon;
		}
		return anyOriginCache.includes(destination) || isSvg;
	},
	// Hashes should guarantee strong caching that doesn't need expiring, so go cache first on those, but route through CF as well
	new CacheFirst({
		cacheName: bielStaticCacheName,
		plugins: [
			new ExpirationPlugin({
				maxEntries: 700,
				purgeOnQuotaError: true,
			}),
			new CacheableResponsePlugin({
				statuses: [200, 304],
			}),
		],
	}),
);

registerRoute(
	({ url, sameOrigin }) => {
		// and unfortunate hack needing in case a firefox download since it'll kill a stream feeding a download if it takes too long
		return (
			sameOrigin &&
			url.pathname.includes("_server-islands/ResourceIndex") &&
			!url.searchParams.get("cache-bust")
		);
	},
	// this is a SWR like strategy, but we also while the revalidting to do a cache-bust query param fetch.
	new NetworkFirst({
		cacheName: bielStaticCacheName,
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 60 * 60, // an hour w/o query param in browser
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200, 304],
			}),
		],
	}),
	"POST",
);

// pf_meta, pf_index, pf_fragment:
registerRoute(
	({ sameOrigin, request }) => {
		// https://developer.mozilla.org/en-US/docs/Web/API/Request/destination#font
		// todo: debug if this is caching images or not. It seems like it's not caching the webps for some reason
		const isPageFind = ["pf_meta", "pf_index", "pf_fragment"].some((item) =>
			request.url.includes(item),
		);
		return isPageFind && sameOrigin;
	},
	// Hashes should guarantee strong caching that doesn't need expiring, so go cache first on those, but route through CF as well
	new CacheFirst({
		cacheName: bielPagefindCacheName,
		plugins: [
			new ExpirationPlugin({
				maxEntries: 2000,
				purgeOnQuotaError: true,
			}),
			new CacheableResponsePlugin({
				statuses: [0, 200, 304],
			}),
		],
	}),
);
