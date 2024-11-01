import type {
  DirectoryListing,
  ScriptureStoreState,
  TsDirectoryFile,
  TsDirectoryLang,
} from "@customTypes/types";
import type {domainScripture} from "@src/data/pubDataApi";
import {For, Show, Suspense, createSignal, onMount} from "solid-js";
import {ScripturalView} from "./ContentScriptural";
import {PeripheralMenu} from "./Menu";
import {useResourceSingleContext} from "./ResourceSingleContext";
import {Checkbox} from "@kobalte/core/checkbox";

type ContentViewProps = {
  classes?: string;
};
export function ContentView(props: ContentViewProps) {
  const {
    fitsScripturalSchema,
    activeContent,
    viewType,
    setViewType,
    selectedTsFolder,
    tsFilesToDownload,
  } = useResourceSingleContext();

  return (
    <Suspense>
      <Show when={viewType() === "readable"}>
        <div class={`${props.classes || ""}`}>
          <Show when={fitsScripturalSchema()}>
            <ScripturalView />
          </Show>
        </div>
        <Show when={!fitsScripturalSchema()}>
          <PeripheralView content={activeContent} />
        </Show>
      </Show>
      <Show when={viewType() === "downloadable"}>
        {/* <p>{tsFolders()}</p> */}
        <div class={`${props.classes || ""} pb-16! `}>
          <DownloadableView tsTree={selectedTsFolder()} loopIter={1} />
        </div>
      </Show>
    </Suspense>
  );
}

function DownloadableView(props: {
  tsTree:
    | {
        folderName: string;
        subTree: TsDirectoryLang;
      }
    | undefined;
  loopIter?: number;
}) {
  const {tsFilesToDownload, setTsFilesToDownload, downloadableSearchTerm} =
    useResourceSingleContext();
  // const [wholeFolderChecked, setWholeFolderChecked] = createSignal(false);
  const wholeChecked = () => {
    return props.tsTree?.subTree.files.every((file) =>
      tsFilesToDownload().has(file)
    );
  };
  if (!props.tsTree) {
    return null;
  }
  const isChecked = (file: TsDirectoryFile) => {
    debugger;
    return tsFilesToDownload().has(file);
  };

  const toggle = (file: TsDirectoryFile) => {
    if (isChecked(file)) {
      setTsFilesToDownload((prev) => {
        prev.delete(file);
        return new Set(prev);
      });
    } else {
      setTsFilesToDownload((prev) => {
        prev.add(file);
        return new Set(prev);
      });
    }
  };
  const selectSubTree = (wholeChecked: boolean, files: TsDirectoryFile[]) => {
    setTsFilesToDownload((prev) => {
      files.forEach((file) => {
        wholeChecked ? prev.delete(file) : prev.add(file);
      });
      // setWholeFolderChecked(!wholeFolderChecked());
      return new Set(prev);
    });
  };

  const filterFilesAgainstSearch = (files: TsDirectoryFile[]) => {
    const searchTerm = downloadableSearchTerm().toLowerCase();
    if (!searchTerm) return files;
    return files.filter((file) => {
      return file.fileName.toLowerCase().includes(searchTerm);
    });
  };

  const marginInline = props.loopIter ? props.loopIter * 12 : 0;
  return (
    <div
      class={`${
        props.loopIter && props.loopIter === 1
          ? "border-s border-brand-dark"
          : ""
      }`}
    >
      <h2
        style={{
          "padding-inline-start": `${marginInline}px`,
          "z-index": `${props.loopIter ? props.loopIter : 1}`,
        }}
        class="font-600 text-xl sticky top-0 bg-surface-primary  pb-2 text-onSurface-primary"
      >
        <Show
          when={filterFilesAgainstSearch(props.tsTree.subTree.files).length}
        >
          <Checkbox
            checked={wholeChecked()}
            onChange={() =>
              selectSubTree(
                wholeChecked() || false,
                filterFilesAgainstSearch(props.tsTree!.subTree.files)
              )
            }
            class="flex items-center gap-2"
          >
            <Checkbox.Input />
            <Checkbox.Control class="h-4 w-4 rounded-2px border relative border-brand-base data-[checked]:(bg-brand-base text-onSurface-invert border-none)">
              <Checkbox.Indicator class="">
                <span class="i-material-symbols:check w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
              </Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label class="data-[checked]:(text-brand-base) transition-colors transition-duration-25">
              {" "}
              {props.tsTree.folderName}
            </Checkbox.Label>
          </Checkbox>
        </Show>
        <Show
          when={!filterFilesAgainstSearch(props.tsTree.subTree.files).length}
        >
          {props.tsTree.folderName}
        </Show>
      </h2>
      <Show when={filterFilesAgainstSearch(props.tsTree.subTree.files).length}>
        <ul
          style={{
            "padding-inline-start": `${marginInline}px`,
            "z-index": `${props.loopIter ? props.loopIter : 1}`,
          }}
          class="flex flex-col gap-2 text-onSurface-secondary"
        >
          <For each={filterFilesAgainstSearch(props.tsTree.subTree.files)}>
            {(file) => (
              <li
                class={`relative pis-0px ${
                  props.loopIter && props.loopIter > 0
                    ? 'before:(content-[""]  bg-brand-dark w-[var(--fileWidth)]  h-1px start-[var(--inlineStart)] absolute top-50% translate-y--50%) font-500 last:mbe-4'
                    : ""
                }
                `}
                style={{
                  "--inlineStart": `-${marginInline}px`,
                  "--fileWidth": `${marginInline - 2}px`,
                }}
              >
                <Checkbox
                  checked={isChecked(file)}
                  onChange={() => toggle(file)}
                  class="flex items-center gap-2"
                >
                  <Checkbox.Input />
                  <Checkbox.Control class="h-4 w-4 rounded-2px border relative border-brand-base data-[checked]:(bg-brand-base text-onSurface-invert border-none)">
                    <Checkbox.Indicator class="">
                      <span class="i-material-symbols:check w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
                    </Checkbox.Indicator>
                  </Checkbox.Control>
                  <Checkbox.Label class="data-[checked]:(text-brand-base) ">
                    {file.fileName}
                  </Checkbox.Label>
                </Checkbox>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show when={Object.keys(props.tsTree.subTree.folders).length}>
        <ul class="">
          <For each={Object.entries(props.tsTree.subTree.folders)}>
            {([folderName, folder]) => {
              return (
                <DownloadableView
                  loopIter={props.loopIter ? props.loopIter + 1 : 1}
                  tsTree={{
                    folderName,
                    subTree: folder,
                  }}
                />
              );
            }}
          </For>
        </ul>
      </Show>
    </div>
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
          <div class="theText theTextTw  px-2" innerHTML={twState()?.html!} />
        </div>
        <Show when={!isBig()}>
          <div class="sticky bottom-0">
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
