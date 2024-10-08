export const prerender = false;
import type {Response as WorkerResponse} from "@cloudflare/workers-types";
import type {ZipSrcBodyReq} from "@customTypes/types";
import type {ghFile} from "@src/data/github";
import type {APIRoute} from "astro";
import {downloadZip} from "client-zip";

type swFallbackSourceZip = {
  payload: ZipSrcBodyReq;
  redirectTo: string;
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
  const parsed = JSON.parse(body) as swFallbackSourceZip;
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

  if (payload.type === "gateway") {
    // only one file in list when gateway
    return fetch(`${payload.files[0]!.url}/archive/master.zip`);
  }
  const totalSize = payload.files.reduce(
    // biome-ignore lint/style/noParameterAssign: <easy to see how this reduce works>
    // biome-ignore lint/suspicious/noAssignInExpressions: <easy to see how this reduce works>
    (acc, curr) => (acc += curr.size || 0),
    0
  );
  const stream = downloadZip(zipUsfmFiles(payload.files, originUrl.origin));

  return new Response(stream.body, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Disposition": `attachment; filename="${name}.zip"`,
      "Content-Type": "application/octet-stream",
      "Content-Length": String(totalSize),
    },
  });
};

async function* zipUsfmFiles(
  payload: Array<{
    url: string;
    hash: string | null;
    size: number | null;
  }>,
  originPrefixedUrl: string
) {
  for (const f of payload) {
    try {
      const prefixedUrl = `${originPrefixedUrl}/api/fetchExternal?url=${encodeURIComponent(
        f.url
      )}&hash=${f.hash}`;
      // proxy through fetchExternal due to sha for strong cachign
      const res = await fetch(prefixedUrl);
      yield {
        name: `${f.hash}`,
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
