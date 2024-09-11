import {createSignal} from "solid-js";

export function isAbsoluteUrl(str: string) {
  const isAbsoluteRegex = new RegExp("^(?:[a-z+]+:)?//", "i");
  return isAbsoluteRegex.test(str);
}
export function blocksAreEmpty(blocks: any[]) {
  return blocks.length === 0;
}

// Happens with
type createProgressFetchArgs = {
  url: string;
  expectedLength: number;
};
export function createProgressFetch() {
  const [response, setResponse] = createSignal(null);
}
