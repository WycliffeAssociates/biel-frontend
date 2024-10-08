import type {ScriptureStoreState} from "@customTypes/types";
import type {domainScripture} from "@src/data/pubDataApi";
import {Show, Suspense, createSignal, onMount} from "solid-js";
import {ScripturalView} from "./ContentScriptural";
import {PeripheralMenu} from "./Menu";
import {useResourceSingleContext} from "./ResourceSingleContext";

type ContentViewProps = {
  classes?: string;
};
export function ContentView(props: ContentViewProps) {
  const {fitsScripturalSchema, activeContent} = useResourceSingleContext();
  return (
    <Suspense>
      <div class={`${props.classes || ""}`}>
        <Show when={fitsScripturalSchema()}>
          <ScripturalView />
        </Show>
      </div>
      <Show when={!fitsScripturalSchema()}>
        <PeripheralView content={activeContent} />
      </Show>
    </Suspense>
  );
}

// NOTE: THIS IS ONLY TW RIGHT NOW.  SPLIT INTO A TW SPECIFIC IF OTHER NON SCRIPTURAL SCHEMA STUFF IS SUPPORTED
function PeripheralView(props: {content: ScriptureStoreState}) {
  //
  const {isBig, i18nDict, twState, setTwState, activeContent} =
    useResourceSingleContext();
  const [fetchProgress, setFetchProgress] = createSignal(0);
  const [doShowProgress, setDoShowProgress] = createSignal(false);

  const printAllFile = props.content.rendered_contents.otherFiles.find((f) =>
    f.url.includes("print_all.html")
  );

  onMount(async () => {
    if (!twState()?.html && printAllFile) {
      setTimeout(() => setDoShowProgress(true), 100);
      const res = await fetch(
        `${globalThis.origin}/api/fetchExternal?url=${printAllFile.url}&hash=${printAllFile.hash}`
      );
      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("no reader");
      }
      let received = 0;
      const chunks = [];
      let bodyNotFinsished = true;
      while (bodyNotFinsished) {
        const {done, value} = await reader.read();
        if (done) {
          bodyNotFinsished = false;
        }
        if (value) {
          chunks.push(value);
          received += value.length;
          setFetchProgress(
            Math.round((received / printAllFile.file_size_bytes) * 100)
          );
        }
      }
      const allChunks = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, offset);
        offset += chunk.length;
      }
      const allChunksString = new TextDecoder().decode(allChunks);
      const sectionsRegex = /<div\s+id="[^"]+"[\s\S]*?<hr\/>/gi;
      const sections = allChunksString.match(sectionsRegex);
      if (!sections) {
        throw new Error("no sections found");
      }
      const withMeta = sections
        ?.map((section) => {
          const fragment = new DOMParser().parseFromString(
            section,
            "text/html"
          );
          const idHeader = fragment.querySelector("h2[id]");
          const id = idHeader?.id!;
          const innerText = idHeader?.textContent?.replaceAll('"', "") || null;
          const oneWordSlug =
            idHeader?.textContent?.split(",")[0]?.replaceAll('"', "") ||
            innerText ||
            id ||
            "";
          return {id, innerHtml: section, oneWordSlug};
        })
        .sort((a, b) => {
          return a.oneWordSlug.localeCompare(b.oneWordSlug);
        });
      const sortedHtml = withMeta.reduce((acc, cur) => {
        return acc + cur.innerHtml;
      }, "");
      setTwState({
        menuList: withMeta.map((w) => ({
          id: w.id,
          oneWordSlug: w.oneWordSlug,
        })),
        html: sortedHtml,
        currentWord: withMeta[0]!,
      });
    }
  });

  function TwFallback() {
    return (
      <Show when={doShowProgress()}>
        <div class="md:(col-start-2 row-start-2) max-w-prose">
          {i18nDict.ls_LoadingPercent}
          {fetchProgress()}
        </div>
      </Show>
    );
  }
  // onLoad, fetch print_all.html file... Load it into a document fragment. Take the innerhtml of the body
  return (
    // <div class="row-start-1 col-start-2">
    <>
      <Show when={twState()?.html} fallback={<TwFallback />}>
        <div class="md:(col-start-2 row-start-2) max-w-prose">
          <div
            class="theText theTextTw max-h-80vh overflow-auto px-2"
            innerHTML={twState()?.html!}
          />
        </div>
        <Show when={!isBig()}>
          <div class="sticky bottom-0 bg-pink-100/40">
            <PeripheralMenu
              activeContent={activeContent}
              i18nDict={i18nDict}
              twState={twState}
              setTwState={setTwState}
              isBig={isBig}
            />
          </div>
        </Show>
      </Show>
    </>
    // </div>
  );
}
