import { Search } from "@components/Search";
import { renderToString } from "solid-js/web";

export function injectSearch({ langCode }: { langCode: string }) {
	const renderedSearch = renderToString(
		() => (
			<Search
				isBig={true}
				langCode={langCode}
				injected={true}
				addlClasses="w-full!"
			/>
		),
		{
			renderId: "injectStaticSearch",
		},
	);
	return renderedSearch;
}
