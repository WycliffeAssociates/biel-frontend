import {expect, test} from "@playwright/test";

test.describe("mobile tests", () => {
  test.use({
    viewport: {
      width: 320,
      height: 640,
    },
  });

  test("hamburger menu opens", async ({page}) => {
    await page.goto("/");
    const hamburgerBtn = page.getByTestId("headerMenuMobileOpen");
    await hamburgerBtn.click();
    const menuItems = page.getByTestId("headerMenuItem");
    await expect(menuItems).toHaveCount(3);
  });

  test("Mobile localization works", async ({page}) => {
    await page.goto("/");
    const hamburgerBtn = page.getByTestId("headerMenuMobileOpen");
    await hamburgerBtn.click();
    const localizeBtn = page.getByTestId("headerOpenLocalizeMenu");
    await localizeBtn.click();
    const spanishLink = page.getByTestId("language-picker-item-es");
    await spanishLink.click();
    await expect(page).toHaveURL(/es/);
  });
  // if this works on mobile it works on desktop
  test("language index search works", async ({page}) => {
    await page.goto("/resources/languages");
    const searchInput = page.getByTestId("languageIndexSearch");
    await searchInput.fill("french");
    const results = page.getByTestId("languageIndexResults");
    await expect(results).toContainText("French");
  });
});
