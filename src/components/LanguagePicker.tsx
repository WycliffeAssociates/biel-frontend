import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {LangGlobe, SmallArrowDown} from "@components/Icons";
import {For} from "solid-js";
import type {languageType} from "@customTypes/types";

type LangPickerProps = {
  allLangs: languageType[];
  currentLang: languageType;
};

export function LanguagePicker(props: LangPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger class="flex  gap-2 items-center p-3 border-1 border-surface-border rounded-2xl text-onSurface-secondary fill-onSurface-secondary data-[expanded]:(bg-surface-invert! text-onSurface-invert! fill-onSurface-invert)">
        <DropdownMenu.Icon class="flex gap-2 items-center ">
          {/* <ChevronDownIcon /> */}
          <LangGlobe class="fill-inherit" />
        </DropdownMenu.Icon>
        <span>{props.currentLang.native_name}</span>
        <SmallArrowDown class="fill-inherit" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class="bg-white z-10 right-0 min-w-80 shadow-dark shadow-xl rounded-xl overflow-hidden">
          <For each={props.allLangs}>
            {(item) => (
              <DropdownMenu.Item>
                <a
                  class="flex w-full justify-between p-3 hover:(bg-brand-light text-brand-base) focus:(bg-brand-light text-brand-base)"
                  href={
                    item.localizedUrl ||
                    `${item.code == "en" ? "/" : `/${item.code}`}`
                  }
                >
                  <span>{item.native_name}</span>
                  <span class="text-onSurface-tertiary font-size-[var(--step--2)]">
                    {item.translated_name}
                  </span>
                </a>
              </DropdownMenu.Item>
            )}
          </For>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
}

export function LanguagePickerMobile(props: LangPickerProps) {
  return (
    <ul>
      <For each={props.allLangs}>
        {(item) => (
          <li>
            <a
              class="flex w-full justify-between p-3 hover:(bg-brand-light text-brand-base) focus:(bg-brand-light text-brand-base)"
              href={
                item.localizedUrl ||
                `${item.code == "en" ? "/" : `/${item.code}`}`
              }
            >
              <span>{item.native_name}</span>
              <span class="text-onSurface-tertiary font-size-[var(--step--2)]">
                {item.translated_name}
              </span>
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}
