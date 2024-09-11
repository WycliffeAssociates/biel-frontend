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
    >
      <div class="grid px-2 items-stretch grid-cols-[4rem_1fr] md:(gap-x-40 gap-y-4 justify-center px-0 grid-cols-[1fr_3fr] items-start)">
        {/* Desktop Available Resources.  Mobile nested within the content view */}
        {/* todo: Refactor to top Bar, Available, and View: I.e. divorce top bar from view */}
        <SearchBar classes="hidden md:block" />
        {/* MOBILE AVAILABLE RESOURCES */}
        {/* todo: use grid-col-start and grid-row-start to define areas */}
        {/* <span class="md:hidden">ULB</span> */}
        <Menu classes="grid-col-start-2 md:(mie-auto p-0 max-w-prose w-full)" />
        <AvailableResources
          classes={"grid-row-start-1 md:grid-row-start-2"}
          tsFiles={props.tsFiles}
        />
        <ContentView
          classes={`px-2 col-span-full md:(mie-auto p-0 max-w-prose w-full col-span-1)`}
        />
      </div>
    </ResourceSingleProvider>
  );
}
