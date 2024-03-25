export function isAbsoluteUrl(str: string) {
  const isAbsoluteRegex = new RegExp("^(?:[a-z+]+:)?//", "i");
  return isAbsoluteRegex.test(str);
}
export function blocksAreEmpty(blocks: any[]) {
  return blocks.length === 0;
}

// Happens with
