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
