import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
  type Setter,
} from "solid-js";
import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {Dialog} from "@kobalte/core/dialog";
import {Accordion} from "@kobalte/core/accordion";
import * as R from "ramda";
import {createStore, type SetStoreFunction} from "solid-js/store";
import {
  type contentsForLang,
  type domainPeripheral,
  type domainScripture,
  type RenderedContentRow,
} from "@src/data/pubDataApi";
import {isScriptural, contentContainsSearch} from "./lib";
import type {
  ContentListingProps,
  ScriptureStoreState,
} from "@customTypes/types";
import {createMediaQuery} from "@solid-primitives/media";
import {AvailableResources, SearchBar} from "./AvailableResources";
import {ContentView} from "./ContentView";
import {MenuRow} from "./ContentScriptural";

export function ResourceWrapper(props: ContentListingProps) {
  const isBig = createMediaQuery("(min-width: 768px)", true);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [activeContent, setActiveContent] = createStore<ScriptureStoreState>({
    ...props.contents[0]!,
    activeRowIdx: 0, //points to a row in the rendered_contents array
  });
  const fitsScripturalSchema = () => isScriptural(activeContent);
  const resourceTypes = () => props.contents.map((x) => x.resource_type);
  return (
    <div class="grid px-2 items-stretch grid-cols-[4rem_1fr] md:(gap-x-40 gap-y-4 justify-center px-0 grid-cols-[1fr_3fr] items-start)">
      {/* Desktop Available Resources.  Mobile nested within the content view */}
      {/* todo: Refactor to top Bar, Available, and View: I.e. divorce top bar from view */}
      <SearchBar
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        classes="hidden md:block"
      />
      {/* MOBILE AVAILABLE RESOURCES */}
      {/* todo: use grid-col-start and grid-row-start to define areas */}
      {/* <span class="md:hidden">ULB</span> */}
      <MenuRow
        fitsScripturalSchema={fitsScripturalSchema}
        setActiveContent={setActiveContent}
        langDirection={props.language.direction}
        langCode={props.language.code}
        content={activeContent}
        resourceTypes={resourceTypes}
        classes="grid-col-start-2 md:(mie-auto p-0 max-w-prose w-full)"
      />
      <AvailableResources
        classes={"grid-row-start-1 md:grid-row-start-2 "}
        activeContent={activeContent}
        isBig={isBig}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        allContents={props.contents}
        setActiveContent={setActiveContent}
      />
      <ContentView
        name={activeContent.name}
        fitsScripturalSchema={fitsScripturalSchema}
        selectedContent={activeContent}
        langDirection={props.language.direction}
        setActiveContent={setActiveContent}
        classes={`px-2 col-span-full md:(mie-auto p-0 max-w-prose w-full col-span-1) ${
          // todo, make siblings of menu + content for non scriptural and set the grid col and rows there
          !fitsScripturalSchema() && "row-start-1 col-start-2!"
        }`}
      />
    </div>
  );
}
