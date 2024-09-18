import type {ContentListingProps} from "@customTypes/types";
import {AvailableResources, SearchBar} from "./AvailableResources";
import {ContentView} from "./ContentView";
import {ResourceSingleProvider} from "./ResourceSingleContext";
import {Menu} from "./Menu";

export function ResourceWrapper(props: ContentListingProps) {
  return (
    <ResourceSingleProvider
      allLangContents={props.contents}
      langDirection={props.language.direction}
      langCode={props.language.code}
      i18nDict={props.i18nDict}
    >
      <div class="grid px-2 items-stretch  md:(gap-x-40 gap-y-4 justify-center px-0 grid-cols-[1fr_3fr] items-start)">
        {/* Desktop Available Resources.  Mobile nested within the content view */}
        {/* todo: Refactor to top Bar, Available, and View: I.e. divorce top bar from view */}
        <SearchBar classes="hidden md:block" />
        {/* MOBILE AVAILABLE RESOURCES */}
        {/* todo: use grid-col-start and grid-row-start to define areas */}
        {/* <span class="md:hidden">ULB</span> */}
        <Menu classes="md:(mie-auto p-0 max-w-prose w-full)" />
        <AvailableResources
          classes={" md:(grid-row-start-2)"}
          tsFiles={props.tsFiles}
        />
        <ContentView classes={`px-2  md:(mie-auto p-0 max-w-prose w-full )`} />
      </div>
    </ResourceSingleProvider>
  );
}
