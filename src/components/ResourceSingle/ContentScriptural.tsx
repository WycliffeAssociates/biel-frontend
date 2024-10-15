import type {ScriptureStoreState} from "@customTypes/types";
import type {ZipSrcBodyReq} from "@customTypes/types";
import {Accordion} from "@kobalte/core/accordion";
import {Dialog} from "@kobalte/core/dialog";
import {createMediaQuery} from "@solid-primitives/media";
import type {RenderedContentRow} from "@src/data/pubDataApi";
import type {i18nDictType} from "@src/i18n/strings";
import {
  For,
  Match,
  type Resource,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
  onMount,
} from "solid-js";
import type {SetStoreFunction} from "solid-js/store";
import {DownloadOptions} from "./DownloadOptions";
import {useResourceSingleContext} from "./ResourceSingleContext";
import {
  changeActiveRow,
  changeActiveRowByUrl,
  fetchHtmlChapters,
  getBoundingRectMenu,
  resourceByBookChap,
  scrollIntoViewIfNeeded,
} from "./lib";

// type ContentType = domainScripture & ScriptureStoreState;
type ContentType = ScriptureStoreState;

export function ScripturalView() {
  const {
    isBig,
    i18nDict,
    setActiveContent,
    activeContent: content,
    langDirection,
  } = useResourceSingleContext();

  const [text, {refetch}] = createResource(
    // when this source signal changes, i.e. the combo of content name changes, and or the active row changes
    () => ({
      name: content.name,
      selected: content.rendered_contents.htmlChapters[content.activeRowIdx],
    }),
    fetchHtmlChapters,
    {
      ssrLoadFrom: "initial",
    }
  );
  onMount(() => {
    // Deferring fething the initial html for resource so it gets cached in SW and in Cloudlare by its url, by also speeds up perception of things happening since we see the shell and in case this call to resource takes a second
    refetch();
  });
  return (
    <div class="flex flex-col gap-4">
      <TextOfResource text={text} dict={i18nDict} />

      {/* wk: Yes, this is in the wrong "place" by name. Thomas chnaged the designs around on me while trying to get it out the door, so for now it's just in a weird spot w/ respect to names. September 26, 2024 */}
      <Show when={!isBig()}>
        <div class="sticky bottom-4 shadow-surface-primary shadow-[0px_20px_0px_0px]">
          <MenuRow />
          {/* hides text scrolling undernath  */}
          <div class="bg-surface-primary absolute bottom-0 w-full h-full z--1" />
        </div>
      </Show>
    </div>
  );
}

type MenuRowProps = {
  classes?: string;
};
// menu row could be moved, but is here since this menu is strictly scriptpural, so this exists after the branch of scriptural vs non in logic
export function MenuRow(props: MenuRowProps) {
  const {setActiveContent, activeContent, isBig, langDirection, i18nDict} =
    useResourceSingleContext();

  const activeRow = () =>
    activeContent.rendered_contents.htmlChapters[activeContent.activeRowIdx];
  return (
    <div class={`flex gap-4 ${props.classes || ""}`}>
      <Menu
        setActiveContent={setActiveContent}
        langDirection={langDirection}
        content={activeContent}
        activeRow={activeRow}
        i18nDict={i18nDict}
      />
      <Show when={isBig()}>
        <DownloadOptions />
      </Show>
    </div>
  );
}

type MenuProps = {
  activeRow: () => RenderedContentRow | undefined;
  content: ContentType;
  langDirection: "ltr" | "rtl";
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  i18nDict: i18nDictType;
};
function Menu(props: MenuProps) {
  const numHtmlChaps = props.content.rendered_contents.htmlChapters.length;
  return (
    <div
      class="flex flex-grow rtl:flex-row-reverse bg-surface-secondary  px-1 py-2 gap-2 rounded-lg md:(rounded-lg)"
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
        i18nDict={props.i18nDict}
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
  i18nDict: i18nDictType;
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
                props.activeRow()?.scriptural_rendering_metadata?.book_name ||
                ""
              }"]`
            );
        }}
      >
        <Dialog.Trigger class="dialog__trigger w-full">
          {props.activeRow()?.scriptural_rendering_metadata?.book_name} {""}
          {props.activeRow()?.scriptural_rendering_metadata?.chapter}
        </Dialog.Trigger>
        <Dialog.Portal>
          <div
            class="absolute"
            style={{
              top: `${isBig() ? `${boundingMenuRect()?.top}px` : "0"}`,
              left: `${isBig() ? `${boundingMenuRect()?.left}px` : "0"}`,
              width: `${isBig() ? `${boundingMenuRect()?.width}px` : "100vw"}`,
            }}
          >
            <Dialog.Content class="absolute top-0 left-0  max-h-screen md:max-h-70vh min-h-200px overflow-auto bg-white w-full shadow-lg shadow-dark md:rounded-lg">
              <Show when={!isBig()}>
                <div class="sticky top-0 py-4 px-1 bg-surface-primary   flex justify-between items-center">
                  <div class="flex gap-4 items-center">
                    <button
                      type="button"
                      class="focus-within:(ring ring-2 ring-offset-2)"
                      onClick={() => setDialogOpen(false)}
                    >
                      <span
                        class={`i-material-symbols:arrow-back ${
                          props.langDirection === "rtl" &&
                          "rotate-180 transform"
                        } w-.75em h-.75em font-size-[var(--step-2)]  bg-onSurface-primary!`}
                      />
                    </button>
                    <Dialog.Title class="">
                      {props.i18nDict.ls_Navigate}
                    </Dialog.Title>
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
                      ?.book_name || "",
                  ]}
                >
                  <For
                    each={Object.keys(resourceByBookChap(props.htmlChapters))}
                  >
                    {(bookName) => (
                      <Accordion.Item value={bookName}>
                        <div class="flex">
                          <Accordion.Trigger class="flex gap-2 bg-surface-secondary w-full justify-between rounded-lg data-[expanded]:(bg-transparent) [&[data-expanded]_span]:rotate-90 px-2 py-3 hover:(bg-surface-secondary)">
                            <Accordion.Header
                              data-accordionbook={bookName}
                              as="h3"
                              class="font-step-0 font-500 text-onSurface-secondary"
                            >
                              {bookName}
                            </Accordion.Header>
                            <span
                              class={
                                "i-ic:round-chevron-left w-1.25em h-1.25em text-onSurface-secondary -rotate-90 "
                              }
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
                                type="button"
                                class="w-full text-center flex-grow max-w-13"
                                onClick={() => {
                                  changeActiveRowByUrl({
                                    url: row.url,
                                    htmlChapters: props.htmlChapters,
                                    setter: props.setActiveContent,
                                  });
                                  if (globalThis.document) {
                                    const theText = document.querySelector(
                                      "[data-js='theText']"
                                    );
                                    if (theText) {
                                      theText.scrollTop = 0;
                                    }
                                  }
                                  setDialogOpen(false);
                                }}
                              >
                                {row.scriptural_rendering_metadata?.chapter}
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
      }
      //ltr next
      return props.activeRowIdx === props.htmlChaptersLength - 1;
    }
    if (props.dir === "prev") {
      //rtl prev
      return props.activeRowIdx === props.htmlChaptersLength - 1;
    }
    //rtl next
    return props.activeRowIdx === 0;
  };

  const flipForRTLIfNeeded = () => {
    if (props.langDirection === "rtl") {
      if (props.dir === "prev") {
        return "next";
      }
      return "prev";
    }
    return props.dir;
  };
  const onBtnClick = () => {
    changeActiveRow({
      activeRowIdx: props.activeRowIdx,
      dir: flipForRTLIfNeeded(),
      htmlChaptersLength: props.htmlChaptersLength,
      setter: props.setActiveContent,
    });
    if (globalThis.document) {
      const theText = document.querySelector("[data-js='theText']");
      if (theText) {
        theText.scrollTop = 0;
      }
    }
  };
  return (
    <Switch>
      <Match when={props.dir === "prev"}>
        <button
          type="button"
          disabled={isDisabled()}
          class="md:inline-block i-ic:round-chevron-left w-1.5em h-1.5em hover:(bg-brand-base) disabled:(cursor-not-allowed! opacity-50 bg-gray-700)"
          onClick={onBtnClick}
        />
      </Match>
      <Match when={props.dir === "next"}>
        <button
          type="button"
          disabled={isDisabled()}
          class=" md:inline-block i-ic:round-chevron-right w-1.5em h-1.5em hover:(bg-brand-base) disabled:(cursor-not-allowed! opacity-50 bg-gray-700)"
          onClick={onBtnClick}
        />
      </Match>
    </Switch>
  );
}

function TextOfResource(props: {
  text: Resource<string | null | undefined>;
  dict: i18nDictType;
}) {
  return (
    <div class="theText  relative" data-css="theText" data-js="theText">
      <Suspense
        fallback={
          <div
            id="theTextFallback "
            innerHTML={props.text.latest || props.dict.ls_Loading}
          />
        }
      >
        <div class="theText px-3 " innerHTML={props.text() || ""} />
      </Suspense>
    </div>
  );
}
