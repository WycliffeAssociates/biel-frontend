export const prerender = false;
import type {APIRoute} from "astro";

// todo: the problem with this is that you can't redirect back to a static page and do anything with the query params unless you go back to invoking javasciprt to read those query params. And if we are reading javascript to validate it onload, then I might as well just submit the form with js and say whatever with html form.  Or, just don't prerender that one page. But I think I"d just rather say forms need js?  not sure why the form currently is GETTING instead of posting though.
export const POST: APIRoute = async ({request, site, url}) => {
  const headerOrigin = url.origin;
  if (import.meta.env.PROD) {
    if (site?.origin != headerOrigin) {
      return new Response(null, {
        status: 403,
      });
    }
  }

  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");

  const body = JSON.stringify({
    success: true,
  });
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
  // Validate the data - you'll probably want to do more than this
  // if (!name || !email || !message) {
  //   return new Response(
  //     JSON.stringify({
  //       message: "Missing required fields",
  //     }),
  //     { status: 400 }
  //   );
  // }
  // Do something with the data, then return a success response
  // return new Response(
  //   JSON.stringify({
  //     message: "Success!"
  //   }),
  //   { status: 200 }
  // );
};
