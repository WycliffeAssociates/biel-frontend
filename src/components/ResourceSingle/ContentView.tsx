import type {ScriptureStoreState} from "@customTypes/types";
import {createSignal, onMount, Show, Suspense} from "solid-js";
import type {SetStoreFunction} from "solid-js/store";
import {isScriptural} from "./lib";
import type {domainScripture, domainPeripheral} from "@src/data/pubDataApi";
import {ScripturalView} from "./ContentScriptural";
import {TwMenu} from "./Tw/TwMenu";

type ContentViewProps = {
  name: string;
  selectedContent: ScriptureStoreState;
  fitsScripturalSchema: () => boolean;
  setActiveContent: SetStoreFunction<ScriptureStoreState>;
  langDirection: "ltr" | "rtl";
  classes?: string;
};
export function ContentView(props: ContentViewProps) {
  return (
    <div class={`${props.classes || ""}`}>
      <Suspense>
        <Show when={props.fitsScripturalSchema()}>
          <ScripturalView
            langDirection={props.langDirection}
            setActiveContent={props.setActiveContent}
            content={
              props.selectedContent as domainScripture & ScriptureStoreState
            }
          />
        </Show>
        <Show when={!props.fitsScripturalSchema()}>
          <PeripheralView content={props.selectedContent} />
        </Show>
      </Suspense>
    </div>
  );
}

// todo: this is gonna have to be a switch based on type:
function PeripheralView(props: {content: ScriptureStoreState}) {
  console.log(props.content);
  const [allWordsHtml, setAllWordsHtml] = createSignal("");
  const [fetchProgress, setFetchProgress] = createSignal(0);
  const [doShowProgress, setDoShowProgress] = createSignal(false);
  const [wordList, setWordList] = createSignal<
    | {
        id: string;
        innerText: string | null;
        oneWordSlug: string;
      }[]
    | null
  >(null);
  const printAllFile = props.content.rendered_contents.otherFiles.find((f) =>
    f.url.includes("print_all.html")
  );

  onMount(async () => {
    if (printAllFile) {
      setTimeout(() => setDoShowProgress(true), 100);
      console.log(printAllFile.file_size_bytes);
      const res = await fetch(
        `/api/fetchExternal?url=${printAllFile.url}&hash=${printAllFile.hash}`
      );
      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("no reader");
      }
      let received = 0;
      let chunks = [];
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
      let allChunks = new Uint8Array(received);
      let offset = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, offset);
        offset += chunk.length;
      }
      const allChunksString = new TextDecoder().decode(allChunks);
      setAllWordsHtml(allChunksString);

      const docFrag = new DOMParser().parseFromString(
        allChunksString,
        "text/html"
      ).body;
      const idSections = [...docFrag.querySelectorAll("h2[id]")];
      const dropdownList = idSections
        .map((section) => {
          const id = section.id;
          const innerText = section.textContent;
          const oneWordSlug =
            section.textContent?.split(",")[0] || innerText || id;
          return {id, innerText, oneWordSlug};
        })
        .sort((a, b) => {
          return a.oneWordSlug.localeCompare(b.oneWordSlug);
        });
      setWordList(dropdownList);

      setAllWordsHtml(allChunksString);
    }
  });

  function TwFallback() {
    return <Show when={doShowProgress()}>Loading ...{fetchProgress()} %</Show>;
  }
  // onLoad, fetch print_all.html file... Load it into a document fragment. Take the innerhtml of the body
  return (
    <div class="row-start-1 col-start-2">
      <TwMenu wordsList={wordList} />
      <Show when={allWordsHtml()} fallback={<TwFallback />}>
        <div
          class="theText theTextTw max-h-80vh overflow-auto"
          innerHTML={allWordsHtml()}
        ></div>
      </Show>
    </div>
  );
}
