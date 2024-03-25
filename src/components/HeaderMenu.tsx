import type {Menu, MenuItem} from "@customTypes/types";
import {isAbsoluteUrl} from "@lib/web";
import {Show, createSignal, For, Switch, Match} from "solid-js";
import {HeaderMenuMobile} from "./HeaderMenuMobile";
import {createMediaQuery} from "@solid-primitives/media";

type HeaderMenuProps = {
  menu: Menu;
  langCode: string;
};
export function HeaderMenu(props: HeaderMenuProps) {
  const [activeIdx, setActiveIdx] = createSignal<number | null>(null);
  const isBig = createMediaQuery("(min-width: 900px)", true);
  const canHover = createMediaQuery("(hover: hover)", true);

  function shapeLink(item: MenuItem) {
    const link = item.attached_post?.uri || item.url;
    if (isAbsoluteUrl(link)) return link;
    if (props.langCode == "en") {
      if (link.startsWith("/")) {
        return link;
      } else return `/${link}`;
    } else if (link.startsWith("/")) {
      return `/${props.langCode}${link}`;
    } else return `/${props.langCode}/${link}`;
  }
  function paneIsActive(idx: number) {
    // debugger;
    return idx == activeIdx();
  }
  function isAlsoParent(item: MenuItem) {
    return item.children?.length;
  }
  // function prependLangIfLocalizeTrue(menuLink) {
  //   if (menuLink.localize) {
  //     return `/${lang}${menuLink.url}`;
  //   } else return menuLink.url;
  // }

  return (
    <div data-pagefind-ignore="all">
      <Show when={!canHover() || !isBig()}>
        <HeaderMenuMobile menu={props.menu} langCode={props.langCode} />
      </Show>
      <Show when={canHover() && isBig()}>
        {/* todo example detecting mobile support*/}
        <div class="">
          <nav
            class="relative p-4 flex items-center justify-between z-10"
            onBlur={() => setActiveIdx(null)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <a href="/" class="w-40 ">
              <img src={`/images/wa_logo.png`} alt="Logo" />
            </a>

            {/* <svg class= xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5" /></svg> */}

            <ul class="flex list-none gap-4 p-0">
              {/* todo */}
              {/* If hover isn't supported, the hamburger is flex-col each top level: (exc. lang. I think it better). It needs to sit where the currently absolutely positioned next layer is. needs buttons for mobile to move left/right  */}
              <For each={props.menu?.items}>
                {(menuLink, index) => {
                  return (
                    <li>
                      <span class="inline-block px-2 hover:bg-primaryLighter rounded-md">
                        <a
                          class="hover:(text-blue-700 font-bold) focus:(text-blue-700 font-bold)"
                          onFocus={() => setActiveIdx(index)}
                          onMouseOver={() => setActiveIdx(index)}
                          href={shapeLink(menuLink)}
                        >
                          {menuLink.title}
                        </a>
                      </span>
                      <Show
                        when={
                          menuLink.children?.length && paneIsActive(index())
                        }
                      >
                        <div class="bg-white top-full py-4 flex absolute left-0 w-full divide-[#E5E8EB] divide-x divide-solid divide-y-0">
                          <div class="p-4 flex flex-col gap-2">
                            <div class="flex gap-2 items-center">
                              <Show when={menuLink.icon}>
                                <span
                                  class="w-6 icon text-#015AD9"
                                  innerHTML={menuLink.icon}
                                />
                              </Show>
                              <h2 class="text-[#015AD9] text-lg font-bold">
                                {menuLink.title}
                              </h2>
                            </div>
                            <p>{menuLink.description}</p>
                          </div>

                          <ul class="p-4 grid grid-cols-[repeat(auto-fit,minmax(175px,1fr))] gap-4 w-full">
                            <For each={menuLink.children}>
                              {(nested) => {
                                return (
                                  <li class="flex flex-col gap-4">
                                    <Switch>
                                      <Match when={isAlsoParent(nested)}>
                                        <span class={"text-sm font-[#66768B]"}>
                                          {nested.title}
                                        </span>
                                      </Match>
                                      <Match when={!isAlsoParent(nested)}>
                                        <LeafNode
                                          menuItem={nested}
                                          href={shapeLink(nested)}
                                        />
                                      </Match>
                                    </Switch>
                                    <Show when={nested.children?.length}>
                                      <ul class="flex flex-col gap-4">
                                        <For each={nested.children}>
                                          {(child) => {
                                            return (
                                              <LeafNode
                                                menuItem={child}
                                                href={shapeLink(child)}
                                              />
                                            );
                                          }}
                                        </For>
                                      </ul>
                                    </Show>
                                  </li>
                                );
                              }}
                            </For>
                          </ul>
                        </div>
                      </Show>
                    </li>
                  );
                }}
              </For>
            </ul>
          </nav>
        </div>
      </Show>
    </div>
  );
}

type leafNodeProps = {
  menuItem: MenuItem;
  href: string;
};
function LeafNode(props: leafNodeProps) {
  return (
    <a
      class="flex flex-col p-2 rounded-lg block hover:(bg-blue-50 text-blue-700) focus:(bg-blue-50 text-blue-700)"
      href={props.href}
    >
      <span class={"font-bold text-lg"}>{props.menuItem.title}</span>
      <span>{props.menuItem.description || "Lorem text for leaf here"}</span>
    </a>
  );
}
// function ParentBranch()
