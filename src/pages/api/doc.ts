export const prerender = false;

import { env } from "cloudflare:workers";
import type { DocRequest } from "@customTypes/types";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	const { DOC_BASE_URL: baseUrl } = env;
	const body = (await request.json()) as DocRequest;
	const docUrl = body.generate_docx
		? `${baseUrl}/documents_docx`
		: `${baseUrl}/documents`;
	try {
		const res = await fetch(docUrl, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		if (!res.ok) {
			throw new Error(
				`${docUrl} responded ${res.status} ${res.statusText}: ${await res.text()}`,
			);
		}
		const taskJson = (await res.json()) as { task_id: string };
		const { task_id } = taskJson;
		return new Response(task_id as string, {
			status: 200,
		});
	} catch (e) {
		console.error(e);
		return new Response(e instanceof Error ? e.message : String(e), {
			status: 400,
		});
	}
};
