export const prerender = false;
import type {APIRoute} from "astro";
import {type docRequest} from "@customTypes/types";

export const POST: APIRoute = async ({request}) => {
  const baseUrl = "https://doc-api.bibleineverylanguage.org";
  const body = (await request.json()) as docRequest;
  const docUrl = body.generate_docx
    ? `${baseUrl}/documents_docx`
    : `${baseUrl}/documents`;
  try {
    const res = await fetch(docUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const taskJson = await res.json();
    const {task_id} = taskJson;
    return new Response(task_id as string, {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 400,
    });
  }
};
