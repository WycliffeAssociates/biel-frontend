import {Show, Suspense, lazy, type Accessor, type Setter} from "solid-js";
import {MenuRow} from "./ContentScriptural";
import {
  useResourceSingleContext,
  type tsFilesToDownload,
  type tsFolderState,
  type twStateType,
} from "./ResourceSingleContext";
import type {ScriptureStoreState, TsDirectoryFile} from "@customTypes/types";
import type {i18nDictType} from "@src/i18n/strings";

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
        <DownloadLoadMenu tsFiles={tsFilesToDownload} tsFolder={tsFolders} />
      </Show>
    </Suspense>
  );
}

function DownloadLoadMenu(props: {
  tsFiles: Accessor<tsFilesToDownload>;
  tsFolder: Accessor<tsFolderState | undefined>;
}) {
  type accType = {
    zipPayload: {
      name: string;
      payload: Omit<TsDirectoryFile, "fileType">[];
    };
    size: number;
  };

  const payload = () =>
    [...props.tsFiles()].reduce(
      (acc: accType, cur) => {
        acc.zipPayload.payload.push(cur);
        acc.size += cur.size;
        return acc;
      },
      {
        zipPayload: {
          payload: [],
          name: props.tsFolder()?.folderName || "Biel Download",
        },
        size: 0,
      }
    );

  function formatBytes(bytes: number) {
    const units = ["bytes", "KB", "MB", "GB"];
    let index = 0;
    let finalBytes = bytes;
    while (finalBytes >= 1000 && index < units.length - 1) {
      finalBytes /= 1000;
      index++;
    }
    return `${Math.round(finalBytes)} ${units[index]}`;
  }

  return (
    <form action="/api/downloadTsFiles" method="post">
      <label class="flex gap-2 items-center">
        {`Download ${formatBytes(payload().size)}`}
        <input
          type="hidden"
          name="zipPayload"
          value={JSON.stringify(payload().zipPayload)}
        />
        <button
          type="submit"
          class="p-2 bg-brand-light text-brand-base rounded-xl focus:bg-brand-base focus:ring-4 focus:ring-brand focus:ring-offset-6 md:aspect-auto md:bg-brand md:border-x-2 md:border-t-2 md:border-b-4 md:border-brand-darkest md:bg-brand-base md:text-onSurface-invert! md:flex md:gap-2 md:items-center md:hover:bg-brand-darkest md:active:bg-brand-darkest"
        >
          Download
        </button>
      </label>
    </form>
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
