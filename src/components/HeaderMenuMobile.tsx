import type {Menu, MenuItem} from "@customTypes/types";
import {isAbsoluteUrl} from "@lib/web";
import {Show, createSignal, For, Switch, Match, createEffect} from "solid-js";

type HeaderMenuProps = {
  menu: Menu;
  langCode: string;
};
export function HeaderMenuMobile(props: HeaderMenuProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [activeIdx, setActiveIdx] = createSignal<number | null>(null);

  // todo: I think just opacity, or slide left/right tween between top menu and sub menu

  function closeMenu(e: KeyboardEvent) {
    if (e.key == "Escape" && isOpen()) {
      setIsOpen(false);
    }
  }
  function paneIsActive(idx: number) {
    // debugger;
    return idx == activeIdx();
  }
  function isAlsoParent(item: MenuItem) {
    return item.children?.length;
  }
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

  createEffect(() => {
    // {/* double check works on ios? */}
    if (isOpen()) {
      console.log("locking body simply");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  });
  // Render top level items:
  // Render Arrow.
  return (
    <div onkeydown={(e) => closeMenu(e)}>
      <nav class="relative">
        <div class="flex justify-between py-2 sm:text-blue">
          <a href="/" class="w-40 block">
            <img src={`/images/wa_logo.png`} alt="Logo" />
          </a>
          <div>
            {/* search */}
            {/* hamburger */}
            <button
              class="active:(outline-primary bg-none) hover:(!bg-transparent text-primary) focus:(!bg-transparent outline-primary outline-1 stroke-black fill-black) icon stroke-black fill-black"
              onClick={() => setIsOpen(!isOpen())}
            >
              <Show
                when={!isOpen()}
                fallback={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    class="stroke-black"
                  >
                    <path
                      fill="currentColor"
                      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                    />
                  </svg>
                }
              >
                <svg
                  class="stroke-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 16 16"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"
                  />
                </svg>
              </Show>
            </button>
          </div>
        </div>

        <Show when={isOpen()}>
          <ul class="flex flex-col divide-y divide-y-gray-100 overflow-scroll z-10 h-screen overflow-y-auto">
            <For each={props.menu.items}>
              {(menuLink, index) => {
                return (
                  <li
                    class="py-4 w-full flex justify-between content-center flex-shrink-0"
                    onClick={() => setActiveIdx(index())}
                  >
                    <span class="font-bold">{menuLink.title}</span>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.96262 11.5124H15.7151L11.0175 6.69169C10.6421 6.30643 10.6421 5.67421 11.0175 5.28895C11.3929 4.90369 11.9994 4.90369 12.3748 5.28895L18.7185 11.7989C18.8077 11.8903 18.8785 11.9988 18.9268 12.1183C18.9751 12.2378 19 12.3659 19 12.4953C19 12.6247 18.9751 12.7528 18.9268 12.8723C18.8785 12.9918 18.8077 13.1003 18.7185 13.1917L12.3844 19.7115C12.2953 19.803 12.1895 19.8755 12.0731 19.925C11.9566 19.9745 11.8318 20 11.7058 20C11.5798 20 11.4549 19.9745 11.3385 19.925C11.2221 19.8755 11.1163 19.803 11.0271 19.7115C10.938 19.6201 10.8673 19.5115 10.8191 19.392C10.7709 19.2725 10.746 19.1444 10.746 19.0151C10.746 18.8858 10.7709 18.7577 10.8191 18.6382C10.8673 18.5187 10.938 18.4101 11.0271 18.3187L15.7151 13.4881H4.96262C4.43318 13.4881 4 13.0436 4 12.5002C4 11.9569 4.43318 11.5124 4.96262 11.5124Z"
                        fill="#343434"
                      />
                    </svg>
                    <Show
                      when={menuLink.children?.length && paneIsActive(index())}
                    >
                      <div class="absolute top-0 bg-white z-10 h-screen overflow-auto w-full ">
                        <div class=" w-full py-2 border-b border-b-[#aaa]">
                          <div class="flex justify-between w-full px-2">
                            <h2 class="text-black text-lg font-bold">
                              {menuLink.title}
                            </h2>
                            <button
                              class="rotate-180 transform "
                              onClick={() => setActiveIdx(null)}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.96262 11.5124H15.7151L11.0175 6.69169C10.6421 6.30643 10.6421 5.67421 11.0175 5.28895C11.3929 4.90369 11.9994 4.90369 12.3748 5.28895L18.7185 11.7989C18.8077 11.8903 18.8785 11.9988 18.9268 12.1183C18.9751 12.2378 19 12.3659 19 12.4953C19 12.6247 18.9751 12.7528 18.9268 12.8723C18.8785 12.9918 18.8077 13.1003 18.7185 13.1917L12.3844 19.7115C12.2953 19.803 12.1895 19.8755 12.0731 19.925C11.9566 19.9745 11.8318 20 11.7058 20C11.5798 20 11.4549 19.9745 11.3385 19.925C11.2221 19.8755 11.1163 19.803 11.0271 19.7115C10.938 19.6201 10.8673 19.5115 10.8191 19.392C10.7709 19.2725 10.746 19.1444 10.746 19.0151C10.746 18.8858 10.7709 18.7577 10.8191 18.6382C10.8673 18.5187 10.938 18.4101 11.0271 18.3187L15.7151 13.4881H4.96262C4.43318 13.4881 4 13.0436 4 12.5002C4 11.9569 4.43318 11.5124 4.96262 11.5124Z"
                                  fill="#343434"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <ul class="flex flex-col px-2 gap-2">
                          <For each={menuLink.children}>
                            {(nested) => {
                              return (
                                <li>
                                  <Switch>
                                    <Match when={isAlsoParent(nested)}>
                                      <span
                                        class={
                                          "text-sm text-#333 mb-2 inline-block"
                                        }
                                      >
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
                                    <ul class="flex flex-col gap-2">
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
        </Show>
      </nav>
    </div>
  );
}

type leafNodeProps = {
  menuItem: MenuItem;
  href: string;
};
function LeafNode(props: leafNodeProps) {
  return (
    <a class="flex flex-col" href={props.href}>
      <span class={"font-bold"}>{props.menuItem.title}</span>
      <span>{props.menuItem.description || "Lorem text for leaf here"}</span>
    </a>
  );
}
