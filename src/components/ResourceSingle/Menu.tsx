import {Show, Suspense, lazy} from "solid-js";
import {useResourceSingleContext} from "./ResourceSingleContext";
import {MenuRow} from "./ContentScriptural";
// import {TwMenu} from "./Tw/TwMenu";
// No need to ship this to most folks langs that won't have a tw
const TwMenu = lazy(() => import("./Tw/TwMenu"));

type MenuProps = {
  classes?: string;
};
export function Menu(props: MenuProps) {
  const {fitsScripturalSchema, isBig} = useResourceSingleContext();
  return (
    <Suspense>
      <Show when={fitsScripturalSchema() && isBig()}>
        <MenuRow classes={props.classes} />
      </Show>
      <Show when={!fitsScripturalSchema() && isBig()}>
        <div data-name="menu" class={`${props.classes || ""}`}>
          <PeripheralMenu />
        </div>
      </Show>
    </Suspense>
  );
}

export function PeripheralMenu() {
  const {activeContent, i18nDict} = useResourceSingleContext();
  const resourceType = activeContent.resource_type;
  console.log("peripheral menu", resourceType);
  return (
    // todo: make a nicer fallback
    <Suspense fallback={i18nDict.ls_Loading}>
      <Show when={resourceType.toLowerCase() === "tw"}>
        <TwMenu />
      </Show>
    </Suspense>
  );
}
