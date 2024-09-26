import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import * as path from "node:path";

export function getDevCachedPages(refresh = false) {
	if (refresh) return false;
	if (import.meta.env.DEV) {
		try {
			const cachePath = path.resolve("src/cachedDevData/pages");
			const pageDevCache = readdirSync(cachePath);
			const pages = pageDevCache.map((pagePath) => {
				const resolvedPath = path.resolve(
					`src/cachedDevData/pages/${pagePath}`,
				);
				const page = readFileSync(resolvedPath, {
					encoding: "utf8",
				});
				const parsed = JSON.parse(page);
				return parsed;
			});
			return pages;
		} catch (error) {
			console.error(error);
		}
	}
}
export function getDevHomePage(refresh = false) {
	if (refresh) return false;
	if (import.meta.env.DEV) {
		const page = readFileSync("src/cachedDevData/home.json", {
			encoding: "utf8",
		});
		const parsed = JSON.parse(page);
		return parsed;
	}
}
// biome-ignore lint/suspicious/noExplicitAny: <don't care for dev caching what is written out>
export function cacheHomePageDev(payload: any) {
	if (import.meta.env.DEV) {
		const cachedVersion = JSON.stringify(payload);
		writeFileSync("src/cachedDevData/home.json", cachedVersion, {
			encoding: "utf8",
		});
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <don't care for dev caching what is written out>
export function cachePageForDevSpeed(payload: any, path: string) {
	if (import.meta.env.DEV) {
		const cachedVersion = JSON.stringify(payload);
		writeFileSync(path, cachedVersion, {
			encoding: "utf8",
		});
	}
}

export function getCachedFooter(forceRefresh = false) {
	if (forceRefresh) return false;
	if (import.meta.env.DEV) {
		try {
			const page = readFileSync("src/cachedDevData/footer.json", {
				encoding: "utf8",
			});
			if (!page) return;
			const parsed = JSON.parse(page);
			return parsed;
		} catch (error) {
			return;
		}
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <don't care for dev caching what is written out>
export function cacheFooterForDev(payload: any) {
	if (import.meta.env.DEV) {
		const cachedVersion = JSON.stringify(payload);
		writeFileSync("src/cachedDevData/footer.json", cachedVersion, {
			encoding: "utf8",
		});
	}
}
type cacheHeaderMenuArgs = {
	forceRefresh?: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <don't care for dev caching what is written out>
	payload?: any;
	action: "get" | "put";
};
export function cacheHeaderMenu({
	forceRefresh,
	payload,
	action,
}: cacheHeaderMenuArgs) {
	const refresh = forceRefresh || false;

	if (import.meta.env.DEV) {
		if (action === "get") {
			if (refresh) return false;
			try {
				const menu = readFileSync("src/cachedDevData/menu.json", {
					encoding: "utf8",
				});
				if (!menu) return;
				const parsed = JSON.parse(menu);
				return parsed;
			} catch (error) {
				return;
			}
		} else if (action === "put") {
			const cachedVersion = JSON.stringify(payload);
			writeFileSync("src/cachedDevData/menu.json", cachedVersion, {
				encoding: "utf8",
			});
		}
	}
}
