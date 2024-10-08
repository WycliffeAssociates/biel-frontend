export const prerender = false;
import type {Response as WorkerResponse} from "@cloudflare/workers-types";
import type {ghFile} from "@src/data/github";
import type {APIRoute} from "astro";
import {downloadZip} from "client-zip";

type downloadTsFilesBody = {
  payload: ghFile[];
  name: string;
};

export const POST: APIRoute = async ({url, locals, request}) => {
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
  const {payload, name} = parsed;
  // const {payload, name} = body;
  console.log({name});
  const originUrl = new URL(request.url);
  // biome-ignore lint/suspicious/noAssignInExpressions: <easy to see how this reduce works>
  // biome-ignore lint/style/noParameterAssign: <easy to see how this reduce works>
  const totalSize = payload.reduce((acc, curr) => (acc += curr.size || 0), 0);
  const stream = downloadZip(zipTsFiles(payload, originUrl.origin));

  return new Response(stream.body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": `attachment; filename="${name}.zip"`,
      "Content-Type": "application/octet-stream",
      "Content-Length": String(totalSize),
    },
  });
};

async function* zipTsFiles(payload: ghFile[], originPrefixedUrl: string) {
  for (const f of payload) {
    try {
      const prefixedUrl = `${originPrefixedUrl}/api/fetchExternal?url=${encodeURIComponent(
        f.url
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
