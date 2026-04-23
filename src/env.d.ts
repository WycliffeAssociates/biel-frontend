/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />
/// <reference types="vite-plugin-pwa/client" />
/// <reference types="vite-plugin-pwa/info" />
type Runtime = import("@astrojs/cloudflare").Runtime;

declare namespace Cloudflare {
	interface Env {
		WORDPRESS_GQL_URL?: string;
		WORDPRESS_REST_MENU_ENDPOINT?: string;
		PUBLIC_DATA_API?: string;
		CMS_URL?: string;
		DOC_UI_URL?: string;
		TURNSTILE_PUBLIC_KEY?: string;
		SECRET_TURNSTILE_KEY?: string;
		CONTACT_FORM_ENDPOINT?: string;
		CONTACT_FORM_EMAILS_BASE64?: string;
		CONTACT_ENV?: string;
		DOC_BASE_URL?: string;
		DOC_FILES_URL?: string;
		GITHUB_TOKEN?: string;
	}
}

declare namespace App {
	interface Locals extends Runtime {}
}

interface Window {
	// biome-ignore lint/suspicious/noExplicitAny: <no client types for this>
	pagefind: any;
}
