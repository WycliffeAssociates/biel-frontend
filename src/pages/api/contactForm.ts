export const prerender = false;
import type {APIRoute} from "astro";

// todo: the problem with this is that you can't redirect back to a static page and do anything with the query params unless you go back to invoking javasciprt to read those query params. And if we are reading javascript to validate it onload, then I might as well just submit the form with js and say whatever with html form.  Or, just don't prerender that one page. But I think I"d just rather say forms need js?  not sure why the form currently is GETTING instead of posting though.
export const POST: APIRoute = async ({request, site, url, locals}) => {
  const headerOrigin = url.origin;
  if (import.meta.env.PROD) {
    if (site?.origin != headerOrigin) {
      return new Response(null, {
        status: 403,
      });
    }
  }
  // Can type it when changing to next version I think
  // @ts-ignore
  const secretTurnstileKey = locals.runtime.env?.SECRET_TURNSTILE_KEY;

  console.log({secretTurnstileKey});

  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");
  const token = data.get("cf-turnstile-response")?.toString() || "";
  const ip = request.headers.get("CF-Connecting-IP")?.toString() || "";

  // Validate the token by calling the
  // "/siteverify" API endpoint.
  let formData = new FormData();
  formData.append("secret", secretTurnstileKey);
  formData.append("response", token);
  formData.append("remoteip", ip);

  const siteVerifyUrl =
    "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(siteVerifyUrl, {
    body: formData,
    method: "POST",
  });

  const outcome = await result.json();
  console.log({outcome});
  if (outcome.success) {
    // ...
    const body = JSON.stringify({
      success: true,
    });
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response(null, {
      status: 403,
    });
  }

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
