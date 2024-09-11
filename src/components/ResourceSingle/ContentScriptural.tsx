import type {ScriptureStoreState} from "@customTypes/types";
import type {RenderedContentRow} from "@src/data/pubDataApi";
import {
  createResource,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
  type Resource,
} from "solid-js";
import type {SetStoreFunction} from "solid-js/store";
import {
  changeActiveRow,
  changeActiveRowByUrl,
  fetchHtmlChapters,
  getBoundingRectMenu,
  resourceByBookChap,
  scrollIntoViewIfNeeded,
} from "./lib";
import {Accordion} from "@kobalte/core/accordion";
import {Dialog} from "@kobalte/core/dialog";
import {createMediaQuery} from "@solid-primitives/media";
import {type zipSrcBodyReq} from "@customTypes/types";
import {DownloadOptions} from "./DownloadOptions";

// type ContentType = domainScripture & ScriptureStoreState;
type ContentType = ScriptureStoreState;
type ScripturalViewProps = {
  content: ContentType;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  langDirection: "ltr" | "rtl";
};
export function ScripturalView(props: ScripturalViewProps) {
  // const activeRow = () =>

  const [text, {refetch}] = createResource(
    // when this source signal changes, i.e. the combo of content name changes, and or the active row changes
    () => ({
      name: props.content.name,
      selected:
        props.content.rendered_contents.htmlChapters[
          props.content.activeRowIdx
        ],
    }),
    fetchHtmlChapters,
    {
      ssrLoadFrom: "initial",
    }
  );
  onMount(() => {
    // Deferring fething this from SSR so as to cache in SW as part of call from client. Everything else seems fasts cause we aren't blocking here
    refetch();
  });
  return (
    <div class="flex flex-col gap-4 fullscreen">
      {/* <MenuRow
        setActiveContent={props.setActiveContent}
        langDirection={props.langDirection}
        content={props.content}
        // activeRowIdx={props.content.activeRowIdx}
        // activeRow={activeRow}
      /> */}
      <TextOfResource text={text} />
    </div>
  );
}

type MenuRowProps = {
  content: ContentType;
  // activeRow: () => RenderedContentRow | undefined;
  resourceTypes: () => string[];
  langDirection: "ltr" | "rtl";
  langCode: string;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  classes?: string;
  isBig: () => boolean;
  zipSrc: () => zipSrcBodyReq;
};
// todo: probably refactor out of being in this file. Can have a menu for for script and non
// todo: some things here are not strictly scriptural vs non scriptraul;
export function MenuRow(props: MenuRowProps) {
  console.log(props.content.gitRepo?.url);

  const activeRow = () =>
    props.content.rendered_contents.htmlChapters[props.content.activeRowIdx];
  return (
    <div class={`flex gap-4 ${props.classes || ""}`}>
      <Menu
        setActiveContent={props.setActiveContent}
        langDirection={props.langDirection}
        content={props.content}
        activeRow={activeRow}
      />

      {/* <DownloadOptions zipSrc={zipSrc} currentContent={props.content} /> */}
      <Show when={props.isBig()}>
        <DownloadOptions />
      </Show>
    </div>
  );
}

// todo: extrct into own props
type MenuProps = {
  activeRow: () => RenderedContentRow | undefined;
  content: ContentType;
  langDirection: "ltr" | "rtl";
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
};
function Menu(props: MenuProps) {
  // todo: the dialog for desktoip
  const numHtmlChaps = props.content.rendered_contents.htmlChapters.length;
  return (
    <div
      class="flex flex-grow rtl:flex-row-reverse bg-surface-secondary  px-1 py-2 gap-2 md:(rounded-lg)"
      data-js="menuBoundingRect"
      data-css="menuBoundingRect"
    >
      <NavAdjacentButton
        dir="prev"
        langDirection={props.langDirection}
        htmlChaptersLength={numHtmlChaps}
        activeRowIdx={props.content.activeRowIdx}
        setActiveContent={props.setActiveContent}
      />
      <MenuDialog
        activeRow={props.activeRow}
        htmlChapters={props.content.rendered_contents.htmlChapters}
        setActiveContent={props.setActiveContent}
        langDirection={props.langDirection}
      />
      <NavAdjacentButton
        activeRowIdx={props.content.activeRowIdx}
        dir="next"
        langDirection={props.langDirection}
        htmlChaptersLength={numHtmlChaps}
        setActiveContent={props.setActiveContent}
      />
    </div>
  );
}

type MenuDialogProps = {
  activeRow: () => RenderedContentRow | undefined;
  htmlChapters: RenderedContentRow[];
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  langDirection: "ltr" | "rtl";
};
function MenuDialog(props: MenuDialogProps) {
  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [boundingMenuRect, setBoundingMenuRect] = createSignal<DOMRect | null>(
    null
  );
  const isBig = createMediaQuery("(min-width: 768px)", true);
  return (
    <div class="relative w-full">
      <Dialog
        open={dialogOpen()}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            getBoundingRectMenu({
              querySelector: "[data-js='menuBoundingRect']",
              setter: setBoundingMenuRect,
            });
          }
          setDialogOpen(isOpen);
          isOpen &&
            scrollIntoViewIfNeeded(
              `[data-accordionbook="${
                props.activeRow()?.scriptural_rendering_metadata.book_name || ""
              }"]`
            );
        }}
      >
        <Dialog.Trigger class="dialog__trigger w-full">
          {props.activeRow()?.scriptural_rendering_metadata.book_name} {""}
          {props.activeRow()?.scriptural_rendering_metadata.chapter}
        </Dialog.Trigger>
        <Dialog.Portal>
          <div
            class="absolute"
            style={{
              top: `${isBig() ? boundingMenuRect()?.top + "px" : "0"}`,
              left: `${isBig() ? boundingMenuRect()?.left + "px" : "0"}`,
              width: `${isBig() ? boundingMenuRect()?.width + "px" : "100vw"}`,
            }}
          >
            <Dialog.Content class="absolute top-0 left-0  max-h-screen md:max-h-70vh min-h-200px overflow-auto bg-white w-full shadow-lg shadow-dark md:rounded-lg">
              <Show when={!isBig()}>
                <div class="sticky top-0 py-4 px-1 bg-surface-primary   flex justify-between items-center">
                  <div class="flex gap-4 items-center">
                    <button
                      class="focus-within:(ring ring-2 ring-offset-2)"
                      onClick={() => setDialogOpen(false)}
                    >
                      <span
                        class={`i-material-symbols:arrow-back ${
                          props.langDirection == "rtl" && "rotate-180 transform"
                        } w-.75em h-.75em font-size-[var(--step-2)]  bg-onSurface-primary!`}
                      />
                    </button>
                    <button />
                    <Dialog.Title class="">Navigation</Dialog.Title>
                  </div>
                  <DownloadOptions />
                </div>
              </Show>
              <Dialog.Description class="w-full">
                <Accordion
                  collapsible
                  class="flex flex-col gap-2 px-1 py-1"
                  defaultValue={[
                    props.activeRow()?.scriptural_rendering_metadata
                      .book_name || "",
                  ]}
                >
                  <For
                    each={Object.keys(resourceByBookChap(props.htmlChapters))}
                  >
                    {(bookName) => (
                      <Accordion.Item value={bookName} class={``}>
                        <div class="flex">
                          <Accordion.Trigger class="flex gap-2 bg-surface-secondary w-full justify-between rounded-lg data-[expanded]:(bg-transparent) [&[data-expanded]_span]:rotate-90 px-2 py-3">
                            <Accordion.Header data-accordionbook={bookName}>
                              {bookName}
                            </Accordion.Header>
                            <span
                              class={`ic:round-chevron-left w-1.5em h-1.5em text-onSurface-secondary -rotate-90 `}
                            />
                          </Accordion.Trigger>
                        </div>
                        <Accordion.Content class="flex flex-wrap gap-y-4 accordion-anim-height">
                          <For
                            each={
                              resourceByBookChap(props.htmlChapters)[bookName]
                            }
                          >
                            {(row) => (
                              <button
                                class="w-full text-center flex-grow max-w-13"
                                onClick={() => {
                                  changeActiveRowByUrl({
                                    url: row.url,
                                    htmlChapters: props.htmlChapters,
                                    setter: props.setActiveContent,
                                  });
                                  setDialogOpen(false);
                                }}
                              >
                                {row.scriptural_rendering_metadata.chapter}
                              </button>
                            )}
                          </For>
                        </Accordion.Content>
                      </Accordion.Item>
                    )}
                  </For>
                </Accordion>
              </Dialog.Description>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog>
    </div>
  );
}
type DownloadOptionsProps = {
  // allContent: RenderedContentRow[];
  zipSrc: () => zipSrcBodyReq;
  currentContent: ScriptureStoreState;
};

type NavAdjacentButtonProps = {
  dir: "next" | "prev";
  langDirection: "ltr" | "rtl";
  htmlChaptersLength: number;
  activeRowIdx: number;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
};
function NavAdjacentButton(props: NavAdjacentButtonProps) {
  const isDisabled = () => {
    if (props.langDirection === "ltr") {
      if (props.dir === "prev") {
        return props.activeRowIdx === 0;
      } else {
        //ltr next
        return props.activeRowIdx === props.htmlChaptersLength - 1;
      }
    } else {
      if (props.dir === "prev") {
        //rtl prev
        return props.activeRowIdx === props.htmlChaptersLength - 1;
      } else {
        //rtl next
        return props.activeRowIdx === 0;
      }
    }
  };
  const flipForRTLIfNeeded = () => {
    if (props.langDirection === "rtl") {
      if (props.dir === "prev") {
        return "next";
      } else {
        return "prev";
      }
    } else return props.dir;
  };
  const onBtnClick = () => {
    changeActiveRow({
      activeRowIdx: props.activeRowIdx,
      dir: flipForRTLIfNeeded(),
      htmlChaptersLength: props.htmlChaptersLength,
      setter: props.setActiveContent,
    });
  };
  return (
    <Switch>
      <Match when={props.dir === "prev"}>
        <button
          disabled={isDisabled()}
          class="hidden md:inline-block i-ic:round-chevron-left w-1.5em h-1.5em hover:(bg-brand-base) disabled:(cursor-not-allowed! opacity-50 bg-gray-700)"
          onClick={onBtnClick}
        />
      </Match>
      <Match when={props.dir === "next"}>
        <button
          disabled={isDisabled()}
          class="hidden md:inline-block i-ic:round-chevron-right w-1.5em h-1.5em hover:(bg-brand-base) disabled:(cursor-not-allowed! opacity-50 bg-gray-700)"
          onClick={onBtnClick}
        />
      </Match>
    </Switch>
  );
}

function TextOfResource(props: {text: Resource<string | null | undefined>}) {
  return (
    <div class="theText max-h-80vh overflow-auto" data-css="theText">
      {/* todo i18n "loading" */}
      <Suspense
        fallback={<div innerHTML={props.text.latest || "Loading..."} />}
      >
        <div class="" innerHTML={props.text() || ""} />
      </Suspense>
    </div>
  );
}
