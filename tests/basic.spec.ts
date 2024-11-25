import {expect, test} from "@playwright/test";
// e2e ideas
// Rendering for each of the
// resources  resources/lang, se form, search bar, breadcrumbs,
//

test.beforeEach(async ({browser}) => {
  console.log({
    testName: test.info().title,
    annotations: test.info().annotations,
    browser: browser.browserType().name(),
  });
});

test("has title", async ({page}) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Bible In Every Language/i);
});

test("no hydration errors", async ({page}) => {
  test.slow();
  const hydrationErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text().toLowerCase();
      // pageerror is only uncaught, but astro caches and handles errors (at least in dev), but we don't want to fail on all errorrs.  The main thing that is  major site regression and will break stuff is a hydration error
      if (text.includes("hydrating")) {
        console.log(text);
        hydrationErrors.push(
          `Hydration error occurred on ${page.url()}, fail build.  Error: ${text}`
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

test("breadcrumbs render", async ({page}) => {
  await page.goto("/resources/source-audio");
  const breadcrumbEl = page.getByTestId("breadcrumbs");
  await expect(breadcrumbEl).toHaveText("Home/Resources/Source Audio");
});

test("nav menu items open on click", async ({page}) => {
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

test("Reader page prefetches adjacent chapters", async ({browser}) => {
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

test("language index sorts works", async ({page}) => {
  await page.goto("/resources/languages");
  await page.waitForResponse(/_server-islands/);
  // Helper function to get all language data in one evaluation
  const getLanguageData = async () => {
    return page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('[data-testid="languageIndexResult"]')
      );
      return elements.map((el) => ({
        code: el.getAttribute("data-code"),
        name: el.getAttribute("data-name"),
        anglicized: el.getAttribute("data-anglicized"),
      }));
    });
  };

  const initialOrder = await getLanguageData();

  const expectedSortedByCode = [...initialOrder].sort((a, b) =>
    a.code!.localeCompare(b.code!)
  );
  const expectedSortedByAnglicized = [...initialOrder].sort(
    (a, b) =>
      a.anglicized!.localeCompare(b.anglicized!) ||
      a.code!.localeCompare(b.code!)
  );
  // const expectedSortedByAnglicizedZA = expectedSortedByAnglicized.reverse();

  const expectedSortedByName = [...initialOrder].sort((a, b) =>
    a.name!.localeCompare(b.name!)
  );
  // const expectedSortedNameReverse = expectedSortedByName.reverse();

  const sortSelectCode = page.getByTestId("resourceIndex-sort-CODE");
  const sortSelectName = page.getByTestId("resourceIndex-sort-NAME");
  const sortSelectAnglicized = page.getByTestId(
    "resourceIndex-sort-ANGLICIZED"
  );

  await sortSelectCode.click();
  const actualSortedByCode = await getLanguageData();
  expect(actualSortedByCode).toStrictEqual(expectedSortedByCode);

  await sortSelectName.click();
  const actualByName = await getLanguageData();
  expect(actualByName).toStrictEqual(expectedSortedByName);

  await sortSelectAnglicized.click();
  const actualSortAnglicized = await getLanguageData();
  expect(expectedSortedByAnglicized).toStrictEqual(actualSortAnglicized);
});

// test that doc download panels opens and works: mock the response maybe?

// todo: Group these into mobile and desktop tests, and in the before group set the viewport on them.  I don't think I ataully need more platforms to run against. Mobile of each of those browers should roughly be fine I think

// todo: tests for urls of a resource in search respose being resource-type?
test("Content Results in Search Link straight to resource", async ({page}) => {
  await page.goto("/");
  const searchBar = page.getByTestId("searchBar");
  await searchBar.click();
  await searchBar.fill("blv");
  // await searchBar.focus();
  const searchResult = page.locator("[data-testid='searchResult']", {
    hasText: /blv/i,
  });
  console.log(searchResult);
  await searchResult.click();
  const selected = page.locator("[data-testid='availableResource']", {
    hasText: /Portuguese Free Bible/i,
  });
  const isSelctedUi = await selected.getAttribute("data-selected");
  expect(isSelctedUi).toBe("true");
});
test("Doc UI popover opens on desktop", async ({page}) => {
  await page.goto("/resources/languages/en");
  const openDownloadOpts = page.getByTestId("openDownloadOptions");
  await openDownloadOpts.click();
  const opts = page.getByTestId("downloadOptionsModal");
  await expect(opts).toBeVisible();
});
