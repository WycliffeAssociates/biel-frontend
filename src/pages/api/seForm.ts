export const prerender = false;

import type { APIRoute } from "astro";
import {
	matchHelpMethodToEmailList,
	type RemotePayloadType,
} from "./contactForm";

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const CONTACT_FORM_PROCESSING_URL = locals.runtime.env
			.CONTACT_FORM_ENDPOINT as string;

		const emailAddresses = matchHelpMethodToEmailList(
			"Scripture Engagement",
			locals.runtime.env.CONTACT_FORM_EMAILS_BASE64 || "{}",
			locals.runtime.env.CONTACT_ENV || "local",
		);

		const formFields = await request.json();
		const hardCodedFormFields = [
			{
				field: "Form Name",
				value: "Scripture Engagement Form",
			},
			{
				field: "Environment",
				value: locals.runtime.env.CONTACT_ENV || "local",
			},
		];
		const replaceArrays = formFields.map(
			(f: { field: string; value: string }) => {
				if (Array.isArray(f.value)) {
					return {
						field: f.field,
						value: f.value.join(", "),
					};
				}
				return f;
			},
		);

		const processingBody: RemotePayloadType = {
			env: locals.runtime.env.CONTACT_ENV || "local",
			addresses: emailAddresses,
			formFields: [...hardCodedFormFields, ...replaceArrays],
		};

		const res = await fetch(CONTACT_FORM_PROCESSING_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(processingBody),
		});

		if ([200, 202].includes(res.status)) {
			return new Response(null, {
				status: 200,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
				},
			});
		}
		throw new Error(res.statusText);
	} catch (e) {
		console.error(e);
		const err = e as Error;
		return new Response(null, {
			status: 500,
			statusText: err.message,
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		});
	}
};
