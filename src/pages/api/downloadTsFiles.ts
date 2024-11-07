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
	// const {payload, name} = body;

	const originUrl = new URL(request.url);
	const payloadToPredict = payload.map((f) => {
		return {
			name: f.path,
			size: f.size,
		};
	});

	const totalSize = predictLength(payloadToPredict);
	const stream: Response = downloadZip(zipTsFiles(payload, originUrl.origin));
	let streamToReturn = stream.body;
	if (import.meta.env.PROD) {
		// @ts-ignore.  https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/#fixedlengthstream.  We know the length, but this is a platform api that is cloufdlare specific, so we can't just return the content length header. Cloudflare will override it.
		const { readable, writable } = new FixedLengthStream(totalSize);
		stream.body?.pipeTo(writable);
		streamToReturn = readable as ReadableStream<Uint8Array>;
	}
	return new Response(streamToReturn, {
		headers: {
			"Content-Length": String(totalSize),
			"Access-Control-Allow-Origin": "*",
			"Content-Disposition": `attachment; filename="${name}.zip"`,
			"Content-Type": "application/octet-stream",
		},
	});
};

async function* zipTsFiles(
	payload: TsDirectoryFile[],
	originPrefixedUrl: string,
) {
	for (const f of payload) {
		try {
			const prefixedUrl = `${originPrefixedUrl}/api/fetchExternal?url=${encodeURIComponent(
				f.url,
			)}&hash=${f.sha}`;
			// proxy through fetchExternal due to sha for strong cachign
			const res = await fetch(prefixedUrl);

			yield {
				name: `${f.path}`,
				input: res,
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
