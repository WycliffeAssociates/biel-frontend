import type { DirectoryListing } from "@customTypes/types";
import slugify from "@sindresorhus/slugify";

export async function getTsFiles(language: string | undefined) {
	if (!language) return;
	const { data, metaDataJson, REPO, USER } = await fetchRepo({
		doFetchMeta: true,
	});
	// console.log(json.tree);
	const blobsOnly = data.tree.filter((t) => {
		const parts = t.path.split("/");
		const lang = parts[1];
		// console.log({lang, language});
		return (
			lang?.toLowerCase()?.includes(`(${language.toLowerCase()})`) &&
			t.type === "blob"
		);
	});
	// console.log({blobsOnly});

	if (!blobsOnly.length) return undefined; // no files in this language

	const folderStructure = blobsOnly.reduce((acc: DirectoryListing, file) => {
		const parts = file.path.split("/");

		const fileName = parts.pop()!;
		const fileType = fileName.split(".").pop()!;
		const lastUpdated = metaDataJson?.[file.path] || null;
		let path = acc;

		parts.forEach((p, i) => {
			if (path && !path[p]) {
				path[p] = { folders: {}, files: [], slug: slugify(p), folderName: p };
			}
			if (i !== parts.length - 1) {
				path = path[p]!.folders;
			}
		});
		const key = Object.keys(path).find((k) => k === parts[parts.length - 1])!;
		path[key]!.files.push({
			fileName,
			sha: file.sha,
			url: `https://github.com/${USER}/${REPO}/raw/master/${file.path}`,
			size: file.size!,
			path: file.path,
			fileType,
			lastUpdated,
		});
		return acc;
	}, {});
	const trainingFolderKey = Object.keys(
		folderStructure.training?.folders || {},
	).find((k) => k.toLowerCase().includes(language.toLowerCase()));
	const supplementalKey = Object.keys(
		folderStructure.supplemental?.folders || {},
	).find((k) => k.toLowerCase().includes(language.toLowerCase()));
	const training = folderStructure.training?.folders[trainingFolderKey!];
	const supplemental = folderStructure.supplemental?.folders[supplementalKey!];
	return { trainingFiles: training, supplementalFiles: supplemental };
}

export type ResourceTypeToIetfList = {
	// resource type: List of {lang: sluggified folder}
	[key: string]: {
		[lang: string]: string;
	};
};
export async function getMapTsFilesLangToResourceType() {
	const { data } = await fetchRepo({ doFetchMeta: false });

	const blobsByLang = data.tree.reduce((acc: ResourceTypeToIetfList, t) => {
		if (t.type !== "blob") return acc;
		const parts = t.path.split("/");
		const parenRegex = /\((.+?)\)/;
		const lang = parts[1]?.match(parenRegex)?.[1];
		const topLevelNamedFolder = parts[2];
		if (!lang || !topLevelNamedFolder) return acc;
		const bracketRegex = /\[(.+?)\]/g;
		const resourceTypes = [...topLevelNamedFolder.matchAll(bracketRegex)].map(
			(match) => match[1],
		);
		// if (!resourceType) return acc;
		if (resourceTypes.length === 0) return acc;
		for (const type of resourceTypes) {
			if (type) {
				if (!acc[type]) {
					acc[type] = {};
				}
				acc[type][lang] = slugify(topLevelNamedFolder);
			}
		}
		return acc;
	}, {});
	return blobsByLang;
}

type FetchRepoArgs = {
	doFetchMeta?: boolean;
};
const githubTreeCacheMaxAgeSeconds = 60 * 60;
async function fetchRepo({ doFetchMeta }: FetchRepoArgs) {
	const USER = "WycliffeAssociates";
	const REPO = "TS-biel-files";
	// const USER = "wa-biel";
	// const REPO = "biel-files";
	// https://api.github.com/repos/WycliffeAssociates/TS-biel-files/git/trees?recursive=true
	const endpoint = `https://api.github.com/repos/${USER}/${REPO}/git/trees/master?recursive=1`;
	const metadataDatesEngpoint = `https://raw.githubusercontent.com/${USER}/${REPO}/refs/heads/master/metadata.json`;

	let cachedRes: Response | undefined;
	let cachedEtag: string | undefined | null;
	// cloudflare production cache
	if (globalThis.caches) {
		const cache = globalThis.caches.default;
		const cacheMatch = await cache.match(endpoint);
		if (cacheMatch) {
			cachedRes = cacheMatch;
			cachedEtag = cacheMatch.headers.get("etag");
		}
	}
	if (cachedRes && isFreshCachedGithubTree(cachedRes)) {
		const metaDataJson = await fetchMetadataJson({
			doFetchMeta,
			metadataDatesEngpoint,
		});
		return {
			data: (await cachedRes.json()) as githubReponse,
			metaDataJson,
			USER,
			REPO,
		};
	}

	// Etag fetches still hit the origin (i.e github) but they avoid the request body, so there will always be the fetch here to check for newest, but there will be no response body if the etag is the same, which lightens up the fetch considerably
	const res = await fetch(endpoint, {
		headers: {
			"User-Agent": "biel_website",
			Accept: "application/vnd.github+json",
			"X-GitHub-Api-Version": "2022-11-28",
			...(cachedEtag && { "If-None-Match": cachedEtag }),
		},
		cf: {
			headers: {
				"Cache-Control": "max-age=20",
			},
		},
	});
	const metaDataJson = await fetchMetadataJson({
		doFetchMeta,
		metadataDatesEngpoint,
	});

	const shouldUseCachedTree = res.status === 304 || (!res.ok && !!cachedRes);
	// unmodified is ok. We handle below. This is an etag check
	if (!res.ok && res.status !== 304 && !cachedRes) {
		console.error("GitHub tree fetch failed with no cached fallback", {
			status: res.status,
			statusText: res.statusText,
			rateLimit: getGithubRateLimitDebug(res),
		});
		throw new Error(res.statusText);
	}
	if (!res.ok && res.status !== 304 && cachedRes) {
		console.warn(
			`GitHub tree fetch failed with ${res.status} ${res.statusText}; using cached tree for ${endpoint}`,
			getGithubRateLimitDebug(res),
		);
	}

	if (globalThis.caches && res.ok && res.status !== 304) {
		// CF: Our implementation of the Cache API respects the following HTTP headers on the response passed to put(): ETAG, Expires, Last-Modified.  ETAG Allows cache.match() to evaluate conditional requests with If-None-Match.
		const headers = new Headers(res.headers);
		headers.set(
			"Cache-Control",
			`public, max-age=${githubTreeCacheMaxAgeSeconds}`,
		);
		headers.set("x-biel-cache-date", new Date().toUTCString());
		await globalThis.caches.default.put(
			endpoint,
			new Response(res.clone().body, {
				status: res.status,
				statusText: res.statusText,
				headers,
			}),
		);
	}
	const json = shouldUseCachedTree
		? ((await cachedRes!.json()) as githubReponse)
		: ((await res.json()) as githubReponse);

	return { data: json, metaDataJson, USER, REPO };
}

function isFreshCachedGithubTree(response: Response) {
	const storedDate =
		response.headers.get("x-biel-cache-date") || response.headers.get("date");
	if (!storedDate) return false;
	const storedMs = Date.parse(storedDate);
	if (!Number.isFinite(storedMs)) return false;
	return Date.now() - storedMs < githubTreeCacheMaxAgeSeconds * 1000;
}

function getGithubRateLimitDebug(res: Response) {
	return {
		limit: res.headers.get("x-ratelimit-limit"),
		remaining: res.headers.get("x-ratelimit-remaining"),
		reset: res.headers.get("x-ratelimit-reset"),
		resource: res.headers.get("x-ratelimit-resource"),
		retryAfter: res.headers.get("retry-after"),
	};
}

async function fetchMetadataJson({
	doFetchMeta,
	metadataDatesEngpoint,
}: {
	doFetchMeta?: boolean;
	metadataDatesEngpoint: string;
}) {
	if (!doFetchMeta) return undefined;
	const metaDataRes = await fetch(metadataDatesEngpoint, {
		headers: {
			"User-Agent": "biel_website",
		},
		cf: {
			headers: {
				"Cache-Control": "s-maxage=86400",
			},
		},
	});
	return metaDataRes.ok
		? ((await metaDataRes.json()) as Record<string, string>)
		: undefined;
}
export async function getLocalizationsForResourceTypes() {
	const USER = "WycliffeAssociates";
	const REPO = "TS-biel-files";
	// const USER = "wa-biel";
	// const REPO = "biel-files";
	// https://api.github.com/repos/WycliffeAssociates/TS-biel-files/git/trees?recursive=true
	const i18nEndpoint = `https://raw.githubusercontent.com/${USER}/${REPO}/refs/heads/master/localizations.json`;

	const res = await fetch(i18nEndpoint);
	if (!res.ok) throw new Error(res.statusText);
	return (await res.json()) as Record<string, Record<string, string>>;
}

export type ghFile = {
	path: string;
	type: "blob";
	sha: string;
	url: string;
	size?: number;
};
type githubReponse = {
	tree: Array<ghFile>;
};
