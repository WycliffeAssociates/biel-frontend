import type { ContentListingProps } from "@customTypes/types";
import { closeQrDialog } from "@lib/web";
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
			englishName={props.language.englishName}
			i18nDict={props.i18nDict}
			docUiUrl={props.docUiUrl}
			tsFiles={props.tsFiles}
			doBustCache={props.doBustCache}
		>
			<div class="h-full grid items-stretch grid-rows-[max-content_1fr] overflow-hidden md:(gap-x-8px gap-y-4 justify-center grid-cols-[minmax(auto,_max-content)_min(70%,_85ch)] items-start justify-between grid-rows-[100%] )">
				<div class="h-max md:(h-full flex flex-col gap-4 overflow-y-auto)">
					<SearchBar classes="hidden md:block pie-4" />
					<AvailableResources classes={""} tsFiles={props.tsFiles} />
				</div>
				<div
					class="h-full overflow-y-auto md:(flex flex-col gap-2 overflow-y-auto) px-2 pbe-2"
					data-name="rightCol"
					data-js="rightCol"
				>
					<Menu classes="self-start md:(mie-auto p-0 max-w-prose w-full)" />
					<ContentView
						classes={`px-2  md:(mie-auto p-0 max-w-prose w-full pb-12 overflow-y-auto) ${
							props.language.direction === "rtl" ? "rtl" : ""
						}`}
					/>
				</div>
			</div>
			<dialog
				id="qrDialog"
				class="relative p-4"
				onKeyDown={(e) => {
					closeQrDialog(e);
				}}
				onClick={(e) => {
					closeQrDialog(e);
				}}
			>
				<div class="flex flex-col gap-1rem items-center justify-center">
					<button
						class="absolute top-2 start-2"
						type="button"
						id="closeQrDialog"
						onClick={() => {
							const el = document.getElementById(
								"qrDialog",
							) as HTMLDialogElement;
							if (el) {
								el.close();
							}
						}}
						autofocus
					>
						<span class="i-mdi:close w-1.5em h-1.5em text-red-500" />
					</button>
					<canvas id="qrCanvas"></canvas>
				</div>
			</dialog>
		</ResourceSingleProvider>
	);
}
