export const prerender = false;

import type { TsDirectoryFile } from "@customTypes/types";
import type { APIRoute } from "astro";
import { downloadZip, predictLength } from "client-zip";

type downloadTsFilesBody = {
	payload: TsDirectoryFile[];
	name: string;
};

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const body = formData.get("zipPayload")?.toString();
	if (!body) {
		return new Response(null, {
			status: 400,
			statusText: "bad request",
		});
	}
	const parsed = JSON.parse(body) as downloadTsFilesBody;
	if (!("payload" in parsed) || !("name" in parsed)) {
		return new Response(null, {
			status: 400,
			statusText: "bad request",
		});
	}
	const { payload, name } = parsed;
	const payloadWithShortenedNames = payload.map((p) => {
		return {
			...p,
			fileName: normalizeFileName(cutFilePrefixIfOver3Parts(p.path)),
		};
	});
	const predictedLength = predictLength(
		payloadWithShortenedNames.map((p) => {
			return {
				name: p.fileName,
				size: p.size,
			};
		}),
	);

	const clientZipStream = downloadZip(
		getResClientZip(payloadWithShortenedNames),
	);
	let streamToReturn = clientZipStream.body;
	if (import.meta.env.PROD) {
		const { readable, writable } = new FixedLengthStream(predictedLength);
		clientZipStream.body?.pipeTo(writable);
		streamToReturn = readable as ReadableStream<Uint8Array<ArrayBuffer>>;
	}

	return new Response(streamToReturn, {
		headers: {
			"Content-Length": String(predictedLength),
			"Access-Control-Allow-Origin": "*",
			"Content-Disposition": `attachment; filename="${name}.zip"`,
			"Content-Type": "application/octet-stream",
		},
	});
};

function cutFilePrefixIfOver3Parts(fileName: string) {
	const split = fileName.split("/");
	if (split.length > 3) {
		return split.slice(2).join("/");
	}
	return fileName;
}
function normalizeFileName(fileName: string) {
	// https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
	return fileName.normalize("NFD").replace(/[\u0300-\u036f]/gu, "");
}

async function* getResClientZip(payload: TsDirectoryFile[]) {
	for (const f of payload) {
		try {
			const res = await fetch(encodeURI(f.url));
			console.log(`fetching ${encodeURI(f.url)}`);
			yield {
				name: f.fileName,
				input: res.body!,
				lastModified: f.lastUpdated,
			};
		} catch (error) {
			console.error(error);
			yield {
				name: null,
				input: new Response(null, {
					status: 404,
				}),
			};
		}
	}
}
