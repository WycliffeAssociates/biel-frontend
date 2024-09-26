import type { ContentListingProps } from "@customTypes/types";
import { AvailableResources, SearchBar } from "./AvailableResources";
import { ContentView } from "./ContentView";
import { Menu } from "./Menu";
import { ResourceSingleProvider } from "./ResourceSingleContext";

export function ResourceWrapper(props: ContentListingProps) {
	return (
		<ResourceSingleProvider
			queryParams={props.queryParams}
			allLangContents={props.contents}
			langDirection={props.language.direction}
			langCode={props.language.code}
			i18nDict={props.i18nDict}
		>
			<div class="grid px-2 items-stretch  md:(gap-x-40 gap-y-4 justify-center  grid-cols-[1fr_3fr] items-start)">
				<SearchBar classes="hidden md:block" />
				<Menu classes="md:(mie-auto p-0 max-w-prose w-full)" />
				<AvailableResources
					classes={" md:(grid-row-start-2)"}
					tsFiles={props.tsFiles}
				/>
				<ContentView classes={"px-2  md:(mie-auto p-0 max-w-prose w-full )"} />
			</div>
		</ResourceSingleProvider>
	);
}
