export const prerender = false;
import type {APIRoute} from "astro";

type remotePayloadType = {
  env: string;
  devEmail?: string;
  formFields: Array<{
    field: string;
    value: string;
  }>;
};

export const POST: APIRoute = async ({request, site, url, locals}) => {
  const requestOrigin = url.origin;
  const CONTACT_FORM_PROCESSING_URL = locals.runtime.env
    .CONTACT_FORM_ENDPOINT as string;
  // site is from astro config. support only same site form submissions
  // todo: decide on reenable this?
  // if (import.meta.env.PROD) {
  //   if (site?.origin !== requestOrigin) {
  //     return new Response(null, {
  //       status: 403,
  //     });
  //   }
  // }
  // Can type it when changing to next version I think
  // @ts-ignore
  const secretTurnstileKey = locals.runtime.env?.SECRET_TURNSTILE_KEY;

  const data = await request.formData();
  const email = data.get("email")?.toString();
  const helpMethod = data.get("method")?.toString();
  const message = data.get("message")?.toString() || "";

  if (!email || !helpMethod) {
    return new Response(null, {
      status: 400,
    });
  }

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
  console.log(outcome);
  if (outcome.success) {
    const formFields = [
      {
        field: "email",
        value: email,
      },
      {
        field: "method of help request",
        value: helpMethod,
      },
      {
        field: "message",
        value: message,
      },
    ];
    const processingBody: remotePayloadType = {
      env: locals.runtime.env.CONTACT_ENV || "local",
      devEmail: "noop",
      // devEmail: locals.runtime.env.CONTACT_DEV_EMAIL || "noop",
      formFields,
    };
    console.log({processingBody});
    const res = await fetch(CONTACT_FORM_PROCESSING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processingBody),
    });
    console.log({
      ...res,
    });
    if ([200, 202].includes(res.status)) {
      return new Response(JSON.stringify({success: true}), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    return new Response(JSON.stringify({success: false}), {
      status: res.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    // SEND FOR PROCESSING
    // return new Response(body, {
    //   status: 200,
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // });
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
