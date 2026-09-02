import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { getMenus, getStaticPageCatalog } from "./data/wp";

const wpPages = defineCollection({
	loader: async () => {
		const gqlUrl = process.env.WORDPRESS_GQL_URL;
		if (!gqlUrl) {
			throw new Error("WORDPRESS_GQL_URL is required to load wpPages");
		}
		const restUrl = process.env.WORDPRESS_REST_MENU_ENDPOINT;
		if (!restUrl) {
			throw new Error(
				"WORDPRESS_REST_MENU_ENDPOINT is required to load wpPages",
			);
		}
		const { routeEntries, routesByGroupId } = await getStaticPageCatalog({
			gqlUrl,
		});
		const menus = await getMenus({ restUrl });
		const visibleLangs = new Set(Object.keys(menus));
		const seenRoutes = new Set<string>();
		const entries = routeEntries
			.filter((entry) => visibleLangs.has(entry.langCode))
			.filter((entry) => {
				if (seenRoutes.has(entry.routeUri)) {
					return false;
				}
				seenRoutes.add(entry.routeUri);
				return true;
			})
			.map((entry) => ({
				id: `${entry.groupId}:${entry.langCode}:${entry.routeUri}`,
				groupId: entry.groupId,
				langCode: entry.langCode,
				routeUri: entry.routeUri,
				wpUri: entry.wpUri,
				localizedUrls: routesByGroupId[entry.groupId] ?? {},
			}));

		// A reachable CMS that returns nothing still builds a "successful" site with
		// every page missing, so treat an empty catalog as a build failure.
		if (entries.length === 0) {
			throw new Error(
				"wpPages resolved to 0 routes. Refusing to build a site with no CMS pages.",
			);
		}

		return entries;
	},
	schema: z.object({
		groupId: z.number(),
		langCode: z.string(),
		routeUri: z.string(),
		wpUri: z.string(),
		localizedUrls: z.record(z.string(), z.string()),
	}),
});

export const collections = {
	wpPages,
};
