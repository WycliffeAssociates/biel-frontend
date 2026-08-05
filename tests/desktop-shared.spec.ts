import { expect, type Page, test } from "@playwright/test";

// e2e ideas
// Rendering for each of the
// resources  resources/lang, se form, search bar, breadcrumbs,
//

test.beforeEach(async ({ browser }) => {
	console.log({
		testName: test.info().title,
		annotations: test.info().annotations,
		browser: browser.browserType().name(),
	});
});

test("has title", async ({ page }) => {
	await page.goto("/");

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Bible In Every Language/i);
});

test.skip("no hydration errors", async ({ page }) => {
	const hydrationErrors = [];
	page.on("console", (message) => {
		if (message.type() === "error") {
			const text = message.text().toLowerCase();
			// pageerror is only uncaught, but astro caches and handles errors (at least in dev), but we don't want to fail on all errorrs.  The main thing that is  major site regression and will break stuff is a hydration error
			if (text.includes("hydrating")) {
				console.log(text);
				hydrationErrors.push(
					`Hydration error occurred on ${page.url()}, fail build.  Error: ${text}`,
				);
			}
		}
	});
	await page.goto("/software");
	await page.goto("/search");
	await page.goto("/resources/languages");
	await page.goto("/resources/languages/en");
	await page.goto("/church-owned-bible-translation/scripture-engagement");

	if (hydrationErrors.length > 0) {
		throw new Error("Failing build due to hydration errors");
	}
});

test("breadcrumbs render", async ({ page }) => {
	await page.goto("/resources/source-audio");
	const breadcrumbEl = page.getByTestId("breadcrumbs");
	await expect(breadcrumbEl).toHaveText("Home/Resources/Source Audio");
});

test("nav menu items open on click", async ({ page }) => {
	await page.goto("/");
	const menuEl = page.getByTestId("header-menu-item").first();
	await menuEl.click();
	const menuExpanded = page.getByTestId("header-menu-pane");
	await expect(menuExpanded).toBeVisible();
});

test("desktop localization menu items open on click and navigate to the correct page", async ({
	page,
}) => {
	await page.goto("/");
	const langPicker = page.getByTestId("language-picker-trigger");
	await langPicker.click();
	const spanishLink = page.getByTestId("language-picker-item-es");
	await spanishLink.click();

	await expect(page).toHaveURL(/es/);
});

test("Reader page prefetches adjacent chapters", async ({ browser }) => {
	const context = await browser.newContext({
		serviceWorkers: "block",
	});
	const page = await context.newPage();
	let networkRequestMadeOnHover = false;

	await page.route(/api\/fetchExternal/, (route) => {
		networkRequestMadeOnHover = true;
		return route.fulfill({
			status: 200,
			body: "mocked external",
			headers: {
				"Access-Control-Allow-Origin": "*",
			},
		});
	});

	await page.goto("/resources/languages/en");
	const nextBtn = page.getByTestId("reader-nav-next");
	const requestPromise = page.waitForRequest(/api\/fetchExternal/);
	await nextBtn.hover();
	await requestPromise;
	expect(networkRequestMadeOnHover).toBe(true);
});

test("language index sorts works", async ({ page }) => {
	await page.goto("/resources/languages");
	// await page.waitForResponse(/_server-islands/);
	// Helper function to get all language data in one evaluation
	const getLanguageData = async () => {
		return page.evaluate(() => {
			const elements = Array.from(
				document.querySelectorAll('[data-testid="languageIndexResult"]'),
			);
			return elements.map((el) => ({
				code: el.getAttribute("data-code")!,
				name: el.getAttribute("data-name")!,
				anglicized: el.getAttribute("data-anglicized")!,
			}));
		});
	};

	const ensureItemsAreSameOrLessThanNext = (
		items: { code: string; name: string; anglicized: string }[],
		key: "code" | "name" | "anglicized",
	) => {
		return items.every((item, index) => {
			const isFirst = index === 0;
			const isLast = index === items.length - 1;
			if (isFirst || isLast) return true;
			const isLess = item[key]!.localeCompare(items[index + 1]![key]!) <= 0;
			if (!isLess) {
				console.log({
					key,
					item,
					next: items[index + 1],
				});
			}
			return isLess;
		});
	};

	// const expectedSortedNameReverse = expectedSortedByName.reverse();

	const sortSelectCode = page.getByTestId("resourceIndex-sort-CODE");
	const sortSelectName = page.getByTestId("resourceIndex-sort-NAME");
	const sortSelectAnglicized = page.getByTestId(
		"resourceIndex-sort-ANGLICIZED",
	);

	await sortSelectCode.click();
	const actualSortedByCode = await getLanguageData();
	expect(ensureItemsAreSameOrLessThanNext(actualSortedByCode, "code")).toBe(
		true,
	);

	await sortSelectName.click();
	const actualByName = await getLanguageData();
	expect(ensureItemsAreSameOrLessThanNext(actualByName, "name")).toBe(true);

	await sortSelectAnglicized.click();
	const actualSortAnglicized = await getLanguageData();
	const everyItemIsSameOrLessThanNext = ensureItemsAreSameOrLessThanNext(
		actualSortAnglicized,
		"anglicized",
	);
	expect(everyItemIsSameOrLessThanNext).toBe(true);
});

// test that doc download panels opens and works: mock the response maybe?

// todo: Group these into mobile and desktop tests, and in the before group set the viewport on them.  I don't think I ataully need more platforms to run against. Mobile of each of those browers should roughly be fine I think

// todo: tests for urls of a resource in search respose being resource-type?
test.skip("Content Results in Search Link straight to resource", async ({
	page,
}) => {
	await page.goto("/");
	const searchBar = page.getByTestId("searchBar");
	await searchBar.click();
	await searchBar.fill("blv");
	// await searchBar.focus();
	const searchResult = page.locator("[data-testid='searchResult']", {
		hasText: /Bíblia Livre/i,
	});
	await searchResult.click();
	const selected = page.locator("[data-testid='availableResource']", {
		hasText: /Portuguese Free Bible/i,
	});
	const isSelctedUi = await selected.getAttribute("data-selected");
	expect(isSelctedUi).toBe("true");
});
test("Doc UI popover opens on desktop", async ({ page }) => {
	await page.goto("/resources/languages/en");
	const openDownloadOpts = page.getByTestId("openDownloadOptions");
	await openDownloadOpts.click();
	const opts = page.getByTestId("downloadOptionsModal");
	await expect(opts).toBeVisible();
});
// The training/supplemental folders shown here (and their testids) come from
// live content in the TS-biel-files GitHub repo, which is edited independently
// of this codebase. Don't hardcode a specific folder's slug - pick whichever
// one currently exists so these tests don't break when content is reorganized.
const firstTrainingFolderBtn = (page: Page) =>
	page
		.getByText("Training Resources", { exact: true })
		.locator("xpath=following-sibling::ul[1]")
		.locator("button")
		.first();

test("github results for language page show", async ({ page }) => {
	await page.goto("/resources/languages/en");
	const tsFileResourceBtn = firstTrainingFolderBtn(page);
	await tsFileResourceBtn.click();
	const contentViewDownloadableFilesList = page.getByTestId(
		"contentViewDownloadableFilesList",
	);
	const listOfFiles = contentViewDownloadableFilesList.locator("li");
	const files = await listOfFiles.all();
	expect(files.length).toBeGreaterThan(0);
});
test("github results for language page show when navigated from resource page", async ({
	page,
}) => {
	await page.goto("/resources/languages/en");
	const folderSlug = await firstTrainingFolderBtn(page).getAttribute(
		"data-testid",
	);

	await page.goto(`/resources/languages/en?download=${folderSlug}`);
	const contentViewDownloadableFilesList = page.getByTestId(
		"contentViewDownloadableFilesList",
	);
	const listOfFiles = contentViewDownloadableFilesList.locator("li");
	const files = await listOfFiles.all();
	expect(files.length).toBeGreaterThan(0);
});
