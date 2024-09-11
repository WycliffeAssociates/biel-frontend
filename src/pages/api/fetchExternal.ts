export const prerender = false;
import type {APIRoute} from "astro";

export const GET: APIRoute = async ({request, url}) => {
  const queryParams = url.searchParams;
  const urlToFetch = queryParams.get("url");
  const hashParam = queryParams.get("hash");
  if (!urlToFetch) {
    return new Response(null, {
      status: 400,
    });
  }
  const res = await fetch(urlToFetch);
  // todo: setting cf cache control headers if thre is a unique hash
  return new Response(res.body, {
    headers: {
      ...res.headers,
      "Access-Control-Allow-Origin": "*",
    },
  });
};
