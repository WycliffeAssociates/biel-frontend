export function isAbsoluteUrl(str: string) {
	const isAbsoluteRegex = /^(?:[a-z+]+:)?\/\//i;
	return isAbsoluteRegex.test(str);
}
export function blocksAreEmpty<T>(blocks: T[]) {
	return blocks.length === 0;
}
