import type {ContentListingProps} from "@customTypes/types";
import {AvailableResources, SearchBar} from "./AvailableResources";
import {ContentView} from "./ContentView";
import {Menu} from "./Menu";
import {ResourceSingleProvider} from "./ResourceSingleContext";

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
    >
      <div class="h-full grid items-stretch grid-rows-[max-content_1fr] overflow-hidden md:(gap-x-30 gap-y-4 justify-center  grid-cols-[max-content_85ch] items-start justify-between grid-rows-[100%] )">
        <div class="h-max md:(h-full flex flex-col gap-4 overflow-y-auto)">
          <SearchBar classes="hidden md:block pie-4" />
          <AvailableResources classes={""} tsFiles={props.tsFiles} />
        </div>
        <div
          class="h-full overflow-y-auto md:(flex flex-col gap-2 overflow-y-auto)"
          data-name="rightCol"
          data-js="rightCol"
        >
          <Menu classes="self-start md:(mie-auto p-0 max-w-prose w-full)" />
          <ContentView
            classes={
              "px-2  md:(mie-auto p-0 max-w-prose w-full pb-12 overflow-y-auto)"
            }
          />
        </div>
      </div>
    </ResourceSingleProvider>
  );
}
