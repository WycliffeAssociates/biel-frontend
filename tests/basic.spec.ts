import {test, expect} from "@playwright/test";

// e2e ideas
// Rendering for each of the
// resources  resources/lang, se form, search bar, breadcrumbs,
//

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
  await expect(page).toHaveURL("/es");
});

// test("Reader page prefetches adjacent chapters", async ({browser}) => {
//   const context = await browser.newContext({
//     serviceWorkers: "allow",
//   });
//   const page = await context.newPage();
//   page.route("**", (route) => {
//     console.log(route.request());
//     route.continue();
//   });
//   // await page.route("**/api/fetchExternal", (route) => {
//   //   // todo: debug why not mocking. And then flesh out some more tests
//   //   // pnpm exec playwright test --ui to check ui.

//   //   console.log("mocking external");
//   //   return route.fulfill({
//   //     status: 200,
//   //     body: "mocked external",
//   //     headers: {
//   //       "Access-Control-Allow-Origin": "*",
//   //     },
//   //   });
//   // });
//   await page.goto("/resources/languages/en");
//   const nextBtn = page.getByTestId("reader-nav-next");
//   await nextBtn.click();
//   await expect(page).toHaveURL(
//     "/resources/languages/en?resource-type=wycliffeassociates/en_ulb&book=GEN&chapter=2"
//   );
// });
