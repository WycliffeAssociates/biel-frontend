import type {contentsForLang} from "@src/data/pubDataApi";
import {createSignal, For, Show, type Accessor, type Setter} from "solid-js";
import {contentContainsSearch, isScriptural} from "./lib";
import type {SetStoreFunction} from "solid-js/store";
import type {ScriptureStoreState} from "@customTypes/types";
import {Dialog} from "@kobalte/core/dialog";

type AvailableResourcesProps = {
  isBig: () => boolean;
  setSearchTerm: Setter<string>;
  searchTerm: Accessor<string>;
  allContents: contentsForLang[];
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  activeContent: ScriptureStoreState;
  classes?: string;
};
// todo: this is likely just gonna be "big", and have a separate export for small
export function AvailableResources(props: AvailableResourcesProps) {
  return (
    <Show
      when={props.isBig()}
      fallback={<AvailableResourcesSmall {...props} />}
    >
      <div
        class={`hidden md:(flex shrink-0 flex-col gap-2) ${
          props.classes || ""
        }`}
      >
        {/* <SearchBar
        setSearchTerm={props.setSearchTerm}
        searchTerm={props.searchTerm}
      /> */}
        <ul class="flex flex-col gap-4">
          <For
            each={contentContainsSearch(props.searchTerm, props.allContents)}
          >
            {(row) => (
              <AvailableResource
                setActiveContent={props.setActiveContent}
                content={row}
                activeContent={props.activeContent}
              />
            )}
          </For>
        </ul>
      </div>
    </Show>
  );
}
function AvailableResourcesSmall(props: AvailableResourcesProps) {
  const [open, setOpen] = createSignal(true);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <Dialog.Trigger
        class={`bg-red-100 relative inline-flex justify-between items-center rounded-s-lg ps-2 text-start ${
          props.classes || ""
        }`}
      >
        {props.activeContent.resource_type}
        <span class="i-ic:round-arrow-drop-down" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <div class="absolute inset-0 w-full h-screen bg-surface-primary ">
          <Dialog.Title class="text-3xl inline-flex items-center ">
            {/* todo i18n */}
            <span class="i-ic:round-arrow-back rtl:rotate-180 w-.75em h-.75em text-onSurface-secondary" />
            Resource Type
          </Dialog.Title>
          <ul class="">
            <For
              each={contentContainsSearch(props.searchTerm, props.allContents)}
            >
              {(row) => (
                <AvailableResource
                  setActiveContent={props.setActiveContent}
                  content={row}
                  activeContent={props.activeContent}
                  additionalOnClick={() => setOpen(false)}
                />
              )}
            </For>
          </ul>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
}

type SearchBarProps = {
  setSearchTerm: Setter<string>;
  searchTerm: Accessor<string>;
  classes?: string;
};
export function SearchBar(props: SearchBarProps) {
  return (
    <div class={`relative ${props.classes || ""}`}>
      <input
        type="text"
        // todo i18n
        placeholder="Search..."
        class="bg-surface-secondary px-6 py-2 rounded-lg w-full border border-surface-border"
        onInput={(e) => props.setSearchTerm(e.currentTarget.value)}
      />
      <span class="absolute ltr:right-2 rtl:left-2 top-1/2 -translate-y-1/2 i-ph:magnifying-glass"></span>
    </div>
  );
}

type AvailableResourceProps = {
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  content: contentsForLang;
  activeContent: ScriptureStoreState;
  additionalOnClick?: () => void;
};
export function AvailableResource(props: AvailableResourceProps) {
  const isSelected = () => {
    return props.content.name === props.activeContent.name;
  };
  function setContent() {
    console.log(`setting ${props.content.name}`);
    // props.setActiveContent(props.content);
    props.setActiveContent((prev) => {
      const newState = {
        ...props.content,
        activeRowIdx: 0,
      };
      if (isScriptural(prev) && isScriptural(props.content)) {
        const currentRow =
          prev.rendered_contents.htmlChapters[prev.activeRowIdx];
        if (!currentRow) return newState;
        const equivalent =
          props.content.rendered_contents.htmlChapters.findIndex(
            (row) =>
              row.scriptural_rendering_metadata.book_slug ===
                currentRow.scriptural_rendering_metadata.book_slug &&
              row.scriptural_rendering_metadata.chapter ===
                currentRow.scriptural_rendering_metadata.chapter
          );
        if (equivalent > -1) {
          newState.activeRowIdx = equivalent;
          return newState;
        } else return newState;
      } else return newState;
    });
  }
  return (
    <li>
      <button
        data-name={props.content.name}
        onClick={() => {
          setContent();
          if (props.additionalOnClick) props.additionalOnClick();
        }}
        class={`w-full text-left p-2  rounded-lg inline-flex justify-between hover:bg-brand-light ${
          isSelected() ? "bg-brand-light text-brand-base" : ""
        }`}
      >
        {props.content.name}
        <span class="i-material-symbols:arrow-right-alt-rounded rtl:rotate-180 md:(hidden)" />
      </button>
    </li>
  );
}
