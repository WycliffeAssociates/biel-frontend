export const prerender = false;
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
	// todo: move to env var
	const baseUrl = "https://doc-api.bibleineverylanguage.org";
	try {
		const body = (await request.json()) as {
			taskId: string;
			suffix: string;
		};
		const { taskId, suffix } = body;

		const res = await fetch(`${baseUrl}/task_status/${taskId}`, {
			method: "GET",
		});
		if (!res.ok) {
			throw new Error("polling failed");
		}
		const json = await res.json();
		const { state, result } = json;
		if (state === "SUCCESS") {
			const downloadUrl = `https://doc-files.bibleineverylanguage.org/${result}.${suffix}`;
			// todo we could not proxy this through the sw and just return binary  stuff here and not in sw. check ohter end of route. Like is there really going to be a need to get that through the sw?
			// const finalRes = await fetch(downloadUrl);
			return new Response(JSON.stringify(json), {
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
		if (state === "FAILURE") {
			return new Response(null, {
				status: 500,
				statusText: "failure with DOC",
			});
		}
		return new Response(JSON.stringify(json));
	} catch (e) {
		console.error(e);
		return new Response(null, {
			status: 400,
		});
	}
};
