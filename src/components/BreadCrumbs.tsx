import type {WpPage} from "@customTypes/types";
import {For, Show} from "solid-js";

type Props = {
  crumbs: WpPage["ancestors"];
};
export function BreadCrumbs(props: Props) {
  if (!props.crumbs || !props.crumbs.nodes?.length) return null;

  return (
    <nav class="hidden md:block bg-surface-primary py-2 border border-y-solid border-surface-border">
      <ul class="list-none flex contain contain-pad">
        <For each={props.crumbs.nodes}>
          {(crumb, idx) => {
            const isLast = idx() === props.crumbs!.nodes.length! - 1;
            return (
              <Show when={!isLast} fallback={<LastCrumb crumb={crumb} />}>
                <li class="flex items-center">
                  <a class={"text-brand-base underline"} href={`${crumb.uri}`}>
                    {crumb.title}
                  </a>
                  <span class="mx-2">/</span>
                </li>
              </Show>
            );
          }}
        </For>
      </ul>
    </nav>
  );
}

type CrumbType = {
  crumb: {
    title: string;
    uri: string;
  };
};
function LastCrumb({crumb}: CrumbType) {
  return (
    <span class={"text-onSurface-tertiary no-underline"}>{crumb.title}</span>
  );
}
