export const prerender = false;
import type {APIRoute} from "astro";

export const POST: APIRoute = async ({request, locals}) => {
  const runtime = locals.runtime;
  const {DOC_BASE_URL, DOC_FILES_URL} = runtime.env;
  try {
    const body = (await request.json()) as {
      taskId: string;
      suffix: string;
    };
    const {taskId, suffix} = body;

    const res = await fetch(`${DOC_BASE_URL}/task_status/${taskId}`, {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error("polling failed");
    }
    const json = await res.json();
    const {state, result} = json;
    const withDownloadUrl = {
      ...json,
      downloadUrl: `${DOC_FILES_URL}/${result}.${suffix}`,
    };
    // even thought the file is ready, return the success message and trigger one more fetch from client.  The client has some UI state to cancel to break its polling loop
    if (state === "SUCCESS") {
      return new Response(JSON.stringify(withDownloadUrl), {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    if (state === "FAILURE") {
      return new Response(null, {
        status: 500,
        statusText: "failure with DOC",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
    return new Response(JSON.stringify(withDownloadUrl));
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
