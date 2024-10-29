import {Show, Suspense, lazy, type Accessor, type Setter} from "solid-js";
import {MenuRow} from "./ContentScriptural";
import {
  useResourceSingleContext,
  type tsFilesToDownload,
  type tsFolderState,
  type twStateType,
} from "./ResourceSingleContext";
import type {
  DirectoryListing,
  ScriptureStoreState,
  TsDirectoryFile,
  TsDirectoryLang,
} from "@customTypes/types";
import type {i18nDictType} from "@src/i18n/strings";
import {Checkbox} from "@kobalte/core/checkbox";
import {getTsFilesPayload} from "@lib/web";
import {formatBytes} from "@src/utils";

// No need to ship this to most folks langs that won't have a tw
const TwMenu = lazy(() => import("./Tw/TwMenu"));

type MenuProps = {
  classes?: string;
};
export function Menu(props: MenuProps) {
  const {
    fitsScripturalSchema,
    isBig,
    twState,
    setTwState,
    activeContent,
    i18nDict,
    viewType,
    tsFilesToDownload,
    tsFolders,
    setTsFilesToDownload,
    downloadableSearchTerm,
    setDownloadableSearchTerm,
  } = useResourceSingleContext();
  return (
    <Suspense>
      <Show when={viewType() === "readable"}>
        <Show when={fitsScripturalSchema() && isBig()}>
          <MenuRow classes={props.classes} />
        </Show>
        <Show when={!fitsScripturalSchema() && isBig()}>
          <div data-name="menu" class={`${props.classes || ""}`}>
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
      <Show when={viewType() === "downloadable" && isBig()}>
        <DownloadLoadableTypeMenu
          tsFiles={tsFilesToDownload}
          tsFolder={tsFolders}
          setTsFilesToDownload={setTsFilesToDownload}
          i18nDict={i18nDict}
          downloadableSearchTerm={downloadableSearchTerm}
          setDownloadableSearchTerm={setDownloadableSearchTerm}
        />
      </Show>
    </Suspense>
  );
}

function DownloadLoadableTypeMenu(props: {
  tsFiles: Accessor<tsFilesToDownload>;
  tsFolder: Accessor<tsFolderState | undefined>;
  setTsFilesToDownload: Setter<tsFilesToDownload>;
  i18nDict: i18nDictType;
  downloadableSearchTerm: Accessor<string>;
  setDownloadableSearchTerm: Setter<string>;
}) {
  const selectAllFiles = (
    isChecked: boolean,
    results: TsDirectoryFile[] = [],
    folder?: TsDirectoryLang
  ) => {
    if (isChecked) {
      const tree = folder ? folder : props.tsFolder()?.subTree;
      const files = tree?.files;
      files?.forEach((file) => {
        // check against search:
        if (props.downloadableSearchTerm()) {
          if (
            file.fileName
              .toLowerCase()
              .includes(props.downloadableSearchTerm().toLowerCase())
          ) {
            results.push(file);
          }
        } else {
          results.push(file);
        }
      });

      if (tree?.folders) {
        Object.entries(tree.folders).forEach(([key, nestedFolder]) => {
          selectAllFiles(isChecked, results, nestedFolder);
        });
      }
      const asSet = new Set(results);
      props.setTsFilesToDownload(asSet);
    } else {
      props.setTsFilesToDownload(new Set<TsDirectoryFile>());
    }
  };

  return (
    <div class="flex gap-4">
      <Checkbox
        // checked={wholeFolderChecked()}
        onChange={(isChecked) => selectAllFiles(isChecked)}
        class="flex items-center gap-2 font-500 "
      >
        <Checkbox.Input />
        <Checkbox.Control class="h-4 w-4 rounded-2px border relative border-brand-base data-[checked]:(bg-brand-base text-onSurface-invert border-none)">
          <Checkbox.Indicator class="">
            <span class="i-material-symbols:check w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4" />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label class="data-[checked]:(text-brand-base) transition-colors transition-duration-25">
          {props.i18nDict.ls_SelectAll}
        </Checkbox.Label>
      </Checkbox>
      <input
        type="text"
        value={props.downloadableSearchTerm()}
        onInput={(e) => props.setDownloadableSearchTerm(e.currentTarget.value)}
        class="bg-surface-secondary px-6 py-2 rounded-lg border border-surface-border"
        placeholder={props.i18nDict.ls_SearchFilesByName}
      />
      <form action="/api/downloadTsFiles" method="post">
        <label class="flex gap-2 items-center">
          <input
            type="hidden"
            name="zipPayload"
            value={JSON.stringify(
              getTsFilesPayload(Array.from(props.tsFiles())).zipPayload
            )}
          />
          <button
            type="submit"
            class="p-2 bg-brand-light text-brand-base rounded-xl focus:bg-brand-base focus:ring-4 focus:ring-brand focus:ring-offset-6 md:aspect-auto md:bg-brand md:border-x-2 md:border-t-2 md:border-b-4 md:border-brand-darkest md:bg-brand-base md:text-onSurface-invert! md:flex md:gap-2 md:items-center md:hover:bg-brand-darkest md:active:bg-brand-darkest"
          >
            {props.i18nDict.ls_DownloadButton}{" "}
            {`(${formatBytes(
              getTsFilesPayload(Array.from(props.tsFiles())).size
            )})`}
          </button>
        </label>
      </form>
    </div>
  );
}

type PeripheralMenuProps = {
  activeContent: ScriptureStoreState;
  i18nDict: i18nDictType;
  twState: Accessor<twStateType>;
  setTwState: Setter<twStateType>;
  isBig: () => boolean;
};

function PeripheralFallback(props: {msg: string}) {
  return <div class="w-full rounded-md bg-surface-secondary ">{props.msg}</div>;
}
export function PeripheralMenu(props: PeripheralMenuProps) {
  const resourceType = props.activeContent.resource_type;
  return (
    <Suspense fallback={<PeripheralFallback msg={props.i18nDict.ls_Loading} />}>
      <Show when={resourceType.toLowerCase() === "tw"}>
        <TwMenu
          isBig={props.isBig}
          twState={props.twState}
          setTwState={props.setTwState}
        />
      </Show>
    </Suspense>
  );
}

// export function DownloadableMenu(props: {}) {}
