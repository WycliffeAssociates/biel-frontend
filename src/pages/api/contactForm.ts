export const prerender = false;
import type {APIRoute} from "astro";

type remotePayloadType = {
  env: string;
  addresses: string[];
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
  const approvedHelpMethods = [
    "Scripture Engagement",
    "Tech Support",
    "Translation Support",
    "Other",
  ];
  if (!email || !helpMethod || !approvedHelpMethods.includes(helpMethod)) {
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

  if (outcome.success) {
    const formFields = [
      {
        field: "Form Name",
        value: "Biel General Contact Form",
      },
      {
        field: "Environment",
        value: locals.runtime.env.CONTACT_ENV || "local",
      },
      {
        field: "Submitter Email",
        value: email,
      },
      {
        field: "Method of Help Requested",
        value: helpMethod,
      },
      {
        field: "Message",
        value: message,
      },
    ];
    const emailAddresses = matchHelpMethodToEmailList(
      helpMethod,
      locals.runtime.env.CONTACT_FORM_EMAILS || "{}",
      locals.runtime.env.CONTACT_ENV || "local"
    );
    const processingBody: remotePayloadType = {
      env: locals.runtime.env.CONTACT_ENV || "local",
      addresses: emailAddresses,
      formFields,
    };

    const res = await fetch(CONTACT_FORM_PROCESSING_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(processingBody),
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
  }
  return new Response(null, {
    status: 403,
  });
};

function matchHelpMethodToEmailList(
  helpMethod: string,
  emailJson: string,
  isDev: boolean
) {
  // don't worry about try catch here. We want to bubble and throw if not valid
  console.log(emailJson);
  const emailMap = JSON.parse(emailJson) as {
    tech: string;
    engagement: string;
    dev: string;
    translationSupport: string;
    other: string;
  };

  function splitOnCommaAndFilter(str: string) {
    return str
      .split(",")
      .filter((s: string) => s.includes("@wycliffeassociates.org"));
  }
  if (isDev) {
    return splitOnCommaAndFilter(emailMap.dev);
  }
  switch (helpMethod) {
    case "Scripture Engagement":
      return splitOnCommaAndFilter(emailMap.engagement);
    case "Tech Support":
      return splitOnCommaAndFilter(emailMap.tech);
    case "Translation Support":
      return splitOnCommaAndFilter(emailMap.translationSupport);
    case "Other":
      return splitOnCommaAndFilter(emailMap.other);
    default:
      return [];
  }
}
