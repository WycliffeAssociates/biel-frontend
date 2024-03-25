import type {Menu, MenuItem} from "@customTypes/types";
import {isAbsoluteUrl} from "@lib/web";
import {Show, createSignal, For} from "solid-js";
import {createMediaQuery} from "@solid-primitives/media";
import {Search} from "@components/Search";

type HeaderMenuProps = {
  menu: Menu;
  langCode: string;
};
export function HeaderMenuOld(props: HeaderMenuProps) {
  const isBig = createMediaQuery("(min-width: 900px)", true);

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
  return (
    <>
      <Show when={!isBig()}>
        <HeaderMenuOldMobile menu={props.menu} langCode={props.langCode} />
      </Show>
      <Show when={isBig()}>
        <div data-pagefind-ignore="all" class="">
          <nav class="relative p-4 flex items-center justify-between z-10">
            <a
              href={`${props.langCode == "en" ? "/" : `/${props.langCode}`}`}
              class="w-40 "
            >
              <img src={`/images/wa_logo.png`} alt="Logo" />
            </a>

            <div class="flex gap-6 items-center">
              <ul class="flex list-none gap-4 p-0">
                <For each={props.menu?.items}>
                  {(menuLink) => {
                    return (
                      <li>
                        <span class="inline-block px-2 hover:bg-primaryLighter rounded-md font-bold">
                          <a
                            class="p-2 rounded-xl hover:(text-blue-700 font-bold bg-[#e0eeff]) focus:(text-blue-700 font-bold bg-[#e0eeff])"
                            href={shapeLink(menuLink)}
                          >
                            {menuLink.title}
                          </a>
                        </span>
                      </li>
                    );
                  }}
                </For>
              </ul>
              <div class="relative z-20">
                <Search langCode={props.langCode} />
              </div>
            </div>
          </nav>
        </div>
      </Show>
    </>
  );
}

export function HeaderMenuOldMobile(props: HeaderMenuProps) {
  const [drawerIsOpen, setDrawerIsOpen] = createSignal(false);
  let menuRef: undefined | HTMLDivElement = undefined;

  function toggleDrawer() {
    if (!menuRef) return;
    const targetHeight = drawerIsOpen() ? 0 : menuRef.scrollHeight;
    const currentHeight = menuRef.clientHeight;

    const animationDuration = 200; // Set your preferred animation duration in milliseconds
    const startTime = performance.now();

    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = elapsed / animationDuration;

      if (drawerIsOpen()) {
        // Close the drawer
        const newHeight = currentHeight - progress * currentHeight;

        menuRef!.style.height = `${newHeight}px`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          menuRef!.style.height = "0"; // Ensure the final state is set
          setDrawerIsOpen(false);
        }
      } else {
        // Open the drawer
        const newHeight =
          currentHeight + progress * (targetHeight - currentHeight);

        menuRef!.style.height = `${newHeight}px`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          menuRef!.style.height = `${targetHeight}px`; // Ensure the final state is set
          setDrawerIsOpen(true);
        }
      }
    }
    requestAnimationFrame(animate);
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

  return (
    <div data-pagefind-ignore="all">
      <nav class="relative p-4 flex items-center justify-between z-10 ">
        <a
          href={`${props.langCode == "en" ? "/" : `/${props.langCode}`}`}
          class="w-40 "
        >
          <img src={`/images/wa_logo.png`} alt="Logo" />
        </a>
        <div class="flex gap-4 items-center">
          <div class="relative z-20">
            <Search langCode={props.langCode} />
          </div>
          <button class="text-3xl" onClick={toggleDrawer}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M4 18q-.425 0-.712-.288T3 17q0-.425.288-.712T4 16h16q.425 0 .713.288T21 17q0 .425-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12q0-.425.288-.712T4 11h16q.425 0 .713.288T21 12q0 .425-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7q0-.425.288-.712T4 6h16q.425 0 .713.288T21 7q0 .425-.288.713T20 8z"
              ></path>
            </svg>
          </button>
        </div>
        <div
          ref={menuRef}
          class="h-0 absolute w-full left-0 top-full z-10 overflow-hidden bg-white"
        >
          <ul class="list-none gap-4 flex flex-col py-4">
            <For each={props.menu?.items}>
              {(menuLink) => {
                return (
                  <li class="">
                    <span class="inline-block px-2 hover:bg-primaryLighter rounded-md font-bold">
                      <a
                        class="p-2 rounded-xl hover:(text-blue-700 font-bold bg-[#e0eeff]) focus:(text-blue-700 font-bold bg-[#e0eeff])"
                        href={shapeLink(menuLink)}
                      >
                        {menuLink.title}
                      </a>
                    </span>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </nav>
    </div>
  );
}
