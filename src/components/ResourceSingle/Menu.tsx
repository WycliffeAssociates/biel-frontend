import {Show, Suspense, lazy, type Accessor, type Setter} from "solid-js";
import {MenuRow} from "./ContentScriptural";
import {
  useResourceSingleContext,
  type twStateType,
} from "./ResourceSingleContext";
import type {ScriptureStoreState} from "@customTypes/types";
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
  } = useResourceSingleContext();
  return (
    <Suspense>
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
    </Suspense>
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
