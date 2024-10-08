export const prerender = false;
import type {APIRoute} from "astro";

export const POST: APIRoute = async ({request, site, url, locals}) => {
  const requestOrigin = url.origin;
  // site is from astro config. support only same site form submissions
  if (import.meta.env.PROD) {
    if (site?.origin !== requestOrigin) {
      return new Response(null, {
        status: 403,
      });
    }
  }
  // Can type it when changing to next version I think
  // @ts-ignore
  const secretTurnstileKey = locals.runtime.env?.SECRET_TURNSTILE_KEY;

  const data = await request.formData();
  const name = data.get("name");
  const email = data.get("email");
  const message = data.get("message");
  const token = data.get("cf-turnstile-response")?.toString() || "";
  const ip = request.headers.get("CF-Connecting-IP")?.toString() || "";

  // Validate the token by calling the
  // "/siteverify" API endpoint.
  const formData = new FormData();
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
  if (outcome.success) {
    // ...
    const body = JSON.stringify({
      success: true,
    });
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  return new Response(null, {
    status: 403,
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
