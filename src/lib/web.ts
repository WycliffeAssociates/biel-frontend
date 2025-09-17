import type { TsDirectoryFile } from "@customTypes/types";

export const bielExternalCacheName = "biel-external";
export const bielStaticCacheName = "biel-static";
export const bielPagefindCacheName = "biel-pagefind";

export function isAbsoluteUrl(str: string) {
	const isAbsoluteRegex = /^(?:[a-z+]+:)?\/\//i;
	return isAbsoluteRegex.test(str);
}
export function blocksAreEmpty<T>(blocks: T[]) {
	return blocks.length === 0;
}

type fetchExternalArgs = Array<{
	url: string;
	hash: string | null;
	size: number | null;
}>;
export async function* fetchExternalUsfmAndCache(files: fetchExternalArgs) {
	for (const f of files) {
		try {
			const url = `/api/fetchExternal?url=${encodeURI(f.url)}&hash=${f.hash}`;
			const splitOnSlashes = f.url.split("/");
			const nextToLast = splitOnSlashes[splitOnSlashes.length - 2];
			const cacheMatch = await caches.match(url, {
				cacheName: bielExternalCacheName,
			});
			if (cacheMatch) {
				yield {
					name: `${nextToLast}.usfm` || `biel-download-${Math.random()}.usfm`,
					input: cacheMatch,
				};
			} else {
				const res = await fetch(url, {
					headers: {
						"User-Agent": "biel_website",
					},
				});
				const clone = res.clone();
				if (res.ok) {
					// store a local copy with the hash
					storeCloneInSwCache(clone, url);
				}
				yield {
					name: `${nextToLast}.usfm` || `biel-download-${Math.random()}.usfm`,
					input: res,
				};
			}
		} catch (error) {
			console.error(error);
			yield {
				name: `${f.url}.usfm` || `biel-download-${Math.random()}.usfm`,
				input: new Response(null, {
					status: 404,
				}),
			};
		}
	}
}

export async function storeCloneInSwCache(
	response: Response,
	cacheKey: string,
) {
	const cache = await caches.open(bielExternalCacheName);
	await cache.put(cacheKey, response.clone());
}

export function getTsFilesPayload(
	files: TsDirectoryFile[],
	folderName = "Biel Download",
) {
	type accType = {
		zipPayload: {
			name: string;
			payload: Omit<TsDirectoryFile, "fileType">[];
		};
		size: number;
	};

	return files.reduce(
		(acc: accType, cur) => {
			acc.zipPayload.payload.push(cur);
			acc.size += cur.size;
			return acc;
		},
		{
			zipPayload: {
				payload: [],
				name: folderName,
			},
			size: 0,
		},
	);
}
export function closeQrDialog(e: KeyboardEvent | MouseEvent) {
	const dialog = document.getElementById("qrDialog") as HTMLDialogElement;
	if (e instanceof KeyboardEvent && e.key === "Escape") {
		dialog.close();
	}
	if (e instanceof MouseEvent && e.target === dialog) {
		dialog.close();
	}
}
