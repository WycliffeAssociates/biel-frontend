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
  const {
    fitsScripturalSchema,
    activeContent,
    resourceTypes,
    langDirection,
    langCode,
    setActiveContent,
    isBig,
    zipSrc,
  } = useResourceSingleContext();
  return (
    <Suspense>
      <div class="max-w-prose">
        <Show when={fitsScripturalSchema()}>
          {/* <TwMenu /> */}
          <MenuRow
            zipSrc={zipSrc}
            isBig={isBig}
            content={activeContent}
            resourceTypes={resourceTypes}
            langDirection={langDirection}
            langCode={langCode}
            setActiveContent={setActiveContent}
          />
        </Show>
        <Show when={!fitsScripturalSchema()}>
          <PeripheralMenu />
        </Show>
      </div>
    </Suspense>
  );
}

function PeripheralMenu() {
  const {activeContent, twState} = useResourceSingleContext();
  const resourceType = activeContent.resource_type;
  return (
    <Suspense fallback={"Loading"}>
      <Show when={resourceType.toLowerCase() === "tw"}>
        <TwMenu twState={twState} />
      </Show>
    </Suspense>
  );
}
