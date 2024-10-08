export const prerender = false;
import type {APIRoute} from "astro";

export const GET: APIRoute = async ({url}) => {
  const urlForDownload = url.searchParams.get("url");
  const fileName = url.searchParams.get("name");
  if (!urlForDownload || !fileName) {
    return new Response(null, {
      status: 400,
      statusText: "bad request. Missing queyr params for url or name",
    });
  }

  try {
    const res = await fetch(urlForDownload);
    if (!res.ok) {
      throw new Error("external download failed");
    }
    return new Response(res.body, {
      headers: {
        "Content-Disposition": `attachment; filename=${fileName}`,
        "Content-Type": "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 400,
    });
  }
};
