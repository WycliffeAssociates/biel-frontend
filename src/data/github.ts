import type { DirectoryListing } from "@customTypes/types";
import slugify from "@sindresorhus/slugify";

export async function getTsFiles(language: string | undefined) {
	if (!language) return;
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

	// Etag fetches still hit the origin (i.e github) but they avoid the request body, so there will always be the fetch here to check for newest, but there will be no response body if the etag is the same, which lightens up the fetch considerably
	const res = await fetch(endpoint, {
		headers: {
			"User-Agent": "biel_website",
			...(cachedEtag && { "If-None-Match": cachedEtag }),
		},
		// @ts-ignore
		cf: {
			headers: {
				"Cache-Control": "max-age=20",
			},
		},
	});
	const metaDataRes = await fetch(metadataDatesEngpoint, {
		// @ts-ignore
		cf: {
			headers: {
				"Cache-Control": "s-maxage=86400",
			},
		},
	});

	// unmodified is ok. We handle below. This is an etag check
	if (!res.ok && res.status !== 304) throw new Error(res.statusText);

	if (globalThis.caches && res.status !== 304) {
		// CF: Our implementation of the Cache API respects the following HTTP headers on the response passed to put(): ETAG, Expires, Last-Modified.  ETAG Allows cache.match() to evaluate conditional requests with If-None-Match.
		globalThis.caches.default.put(endpoint, res.clone());
	}
	const json =
		res.status === 304 && !!cachedRes
			? ((await cachedRes!.json()) as githubReponse)
			: ((await res.json()) as githubReponse);

	const metaDataJson = metaDataRes.ok
		? ((await metaDataRes.json()) as Record<string, string>)
		: undefined;
	// console.log(json.tree);
	const blobsOnly = json.tree.filter((t) => {
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
