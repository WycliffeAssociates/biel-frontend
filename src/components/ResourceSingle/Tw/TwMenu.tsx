import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {createSignal, For, Show, type Accessor, createEffect} from "solid-js";
import {createVirtualizer, Virtualizer} from "@tanstack/solid-virtual";
import {DownloadOptions} from "../DownloadOptions";
import {useResourceSingleContext} from "../ResourceSingleContext";

type TwMenuProps = {};

export default function TwMenu(props: TwMenuProps) {
  const {twState, setTwState, isBig} = useResourceSingleContext();

  const [menuIsOpen, setMenuIsOpen] = createSignal(false);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [currentWord, setCurrentWord] = createSignal(
    twState().menuList ? twState().menuList![0] : null
  );
  const [virtualizer, setVirtualizer] =
    createSignal<Virtualizer<HTMLUListElement, Element>>();
  let menuRef: HTMLElement | undefined;
  let scrollRef: HTMLUListElement | undefined;
  let searchRef: HTMLInputElement | undefined;
  function setWordAndClose(id: string) {
    const matchingWord = twState().menuList!.find((w) => w.id === id);
    setCurrentWord(matchingWord);
    if (matchingWord) {
      setTwState((prev) => ({...prev, currentWord: matchingWord}));
    }
    setMenuIsOpen(false);
  }
  const wordsToShow = () => {
    const lowered = searchTerm()?.toLowerCase();
    if (lowered && twState().menuList) {
      const filtered = twState()
        .menuList!.filter((w) => {
          const fields = [w.oneWordSlug, w.id];
          return fields.some((f) => f.toLowerCase().includes(lowered));
        })
        .sort((a, b) => {
          const aSlug = a.oneWordSlug.toLowerCase();
          const bSlug = b.oneWordSlug.toLowerCase();
          // a.oneWordSlug.startsWith(lowered) ? -1 : 1
          if (aSlug.startsWith(lowered) && !bSlug.startsWith(lowered)) {
            return -1;
          } else if (!aSlug.startsWith(lowered) && bSlug.startsWith(lowered)) {
            return 1;
          } else {
            return 0;
          }
        });

      return filtered;
    } else return twState().menuList;
  };
  const getOverlappingBoundingRect = () => {
    if (menuRef) {
      const rect = menuRef.getBoundingClientRect();
      // Offset so the trigger is now hidden
      rect.height = 0;
      return rect;
    }
  };
  createEffect(() => {
    if (menuIsOpen()) {
      setTimeout(() => {
        console.log("focus");
        // searchRef?.focus();
      }, 100);
      const virtualizer = createVirtualizer({
        count: wordsToShow()!.length,
        getScrollElement: () => scrollRef!,
        getItemKey(index) {
          return wordsToShow()![index]!.id;
        },
        estimateSize: () => 40,
        overscan: 5,
      });
      setVirtualizer(virtualizer);
    }
  });
  console.log(wordsToShow()?.length);
  return (
    <Show when={twState().menuList && currentWord()}>
      <div class="flex gap-4">
        <DropdownMenu
          open={menuIsOpen()}
          sameWidth={true}
          getAnchorRect={getOverlappingBoundingRect}
          preventScroll={false}
          // placement="top-end"
          // onOpenChange={setMenuIsOpen}
        >
          <DropdownMenu.Trigger
            class="w-full rounded-md bg-surface-secondary hover:bg-surface-secondary focus:bg-surface-secondary"
            onClick={() => setMenuIsOpen(true)}
            onKeyUp={(e: KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") setMenuIsOpen(true);
            }}
          >
            <span class="w-full p-2 inline-block" ref={menuRef}>
              {currentWord()?.oneWordSlug} <span class="i:"></span>
            </span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              onEscapeKeyDown={() => setMenuIsOpen(false)}
              onInteractOutside={() => setMenuIsOpen(false)}
              class={`bg-surface-primary w-full  shadow-lg p-2 rounded-md  relative animate-[fadeOut_0.2s_ease-in] data-[expanded]:animate-[fadeIn_.2s_ease-out]`}
            >
              <label for="search" class="">
                <DropdownMenu.Item class="py-2">
                  <input
                    id="search"
                    placeholder="Search"
                    class="px-2 py-1 bg-surface-secondary  border border-solid border-surface-border w-full rounded-md focus:(outline outline-brand-primary outline-solid)"
                    type="text"
                    onKeyDown={(e) => {
                      e.stopPropagation();
                    }}
                    onInput={(e) => {
                      setSearchTerm(e.currentTarget.value);
                    }}
                    ref={searchRef}
                    // value={searchTerm()}
                  />
                </DropdownMenu.Item>
              </label>
              <Show when={menuIsOpen()}>
                <ul
                  class="list-none relative h-60vh overflow-auto scroll-smooth"
                  ref={scrollRef}
                >
                  <For each={virtualizer()!.getVirtualItems()}>
                    {(item) => {
                      const word = wordsToShow()![item.index]!;
                      return (
                        <li
                          onClick={() => setWordAndClose(word.id)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${item.size}px`,
                            transform: `translateY(${item.start}px)`,
                          }}
                          class=""
                        >
                          <DropdownMenu.Item
                            as="a"
                            class="w-full h-full block focus:(bg-brand-light) hover:(bg-brand-light)"
                            href={`#${word.id}`}
                          >
                            {word.oneWordSlug}
                          </DropdownMenu.Item>
                        </li>
                      );
                    }}
                  </For>
                </ul>
              </Show>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>
        <Show when={isBig()}>
          <DownloadOptions />
        </Show>
      </div>
    </Show>
  );
}
