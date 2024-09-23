export const prerender = false;
import type {APIRoute} from "astro";

export const POST: APIRoute = async ({request}) => {
  const baseUrl = "https://doc-api.bibleineverylanguage.org";
  console.log("hitting polling endpoint");
  try {
    const body = (await request.json()) as {
      taskId: string;
      suffix: string;
    };
    console.log(body);
    const {taskId, suffix} = body;

    let res = await fetch(`${baseUrl}/task_status/${taskId}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("polling failed");
    }
    let json = await res.json();
    let {state, result} = json;
    console.log(json);
    if (state === "SUCCESS") {
      const downloadUrl = `https://doc-files.bibleineverylanguage.org/${result}.${suffix}`;
      // todo we could not proxy this through the sw and just return binary  stuff here and not in sw. check ohter end of route
      // const finalRes = await fetch(downloadUrl);
      return new Response(JSON.stringify(json), {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    } else if (state === "FAILURE") {
      return new Response(null, {
        status: 500,
        statusText: "failure with DOC",
      });
    } else {
      return new Response(JSON.stringify(json));
    }
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 400,
    });
  }
};
