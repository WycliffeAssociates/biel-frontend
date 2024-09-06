import {DropdownMenu} from "@kobalte/core/dropdown-menu";
import {createSignal, For, Show, type Accessor} from "solid-js";

type TwMenuProps = {
  wordsList: Accessor<
    | {
        id: string;
        innerText: string | null;
        oneWordSlug: string;
      }[]
    | null
  >;
};

export function TwMenu(props: TwMenuProps) {
  const [currentWord, setCurrentWord] = createSignal(
    props.wordsList() ? props.wordsList()![0] : null
  );
  // debugger;
  return (
    <Show when={props.wordsList()}>
      <div class="bg-surface-secondary">
        <DropdownMenu>
          <DropdownMenu.Trigger class="w-full p-2">
            <span>
              {currentWord()?.oneWordSlug} <span class="i:"></span>
            </span>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content class="bg-surface-primary w-full shadow-md">
              <ul class="list-none">
                <For each={props.wordsList()}>
                  {(word) => (
                    <li onClick={() => setCurrentWord(word)}>
                      <a href={`#${word.id}`}>{word.oneWordSlug}</a>
                    </li>
                  )}
                </For>
              </ul>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>
      </div>
    </Show>
  );
}
