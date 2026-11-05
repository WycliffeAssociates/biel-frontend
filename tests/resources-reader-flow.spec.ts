import { expect, type Locator, type Page, test } from "@playwright/test";

/** Kobalte Dialog.Trigger only toggles via click; Playwright pointer/Enter can miss it. */
async function openChapterPicker(page: Page, chapterBar: Locator) {
	await chapterBar.evaluate((el: HTMLButtonElement) => el.click());
	const matthew = page.locator('[data-accordionbook="Matthew"]');
	try {
		await expect(matthew).toBeVisible({ timeout: 3_000 });
	} catch {
		// Rare race: first open dismissed; retry once
		await chapterBar.evaluate((el: HTMLButtonElement) => el.click());
		await expect(matthew).toBeVisible({ timeout: 5_000 });
	}
}

test.describe("resources reader smoke flow", () => {
	// Header menu uses desktop layout at min-width 900px
	test.use({
		viewport: { width: 1280, height: 800 },
	});

	test("Home → Resources → Browse by Language → English → Matthew 28 ↔ Mark 1", async ({
		page,
	}) => {
		test.setTimeout(60_000);

		await page.goto("/");
		await expect(page).toHaveTitle(/Bible In Every Language/i);

		await page
			.getByTestId("header-menu-item")
			.filter({ hasText: "Resources" })
			.click();
		await expect(page.getByTestId("header-menu-pane")).toBeVisible();

		await page.getByRole("link", { name: "Browse by Language" }).click();
		await expect(page).toHaveURL(/\/resources\/languages\/?$/);
		await expect(
			page.getByRole("heading", { name: "Choose a language" }),
		).toBeVisible();

		const search = page.getByTestId("languageIndexSearch");
		await expect(search).toBeVisible();
		await search.fill("English");

		// Wait for the filter to apply (race: clicking .first() too early hits the unfiltered list)
		const englishResult = page.locator(
			'[data-testid="languageIndexResult"][data-code="en"]',
		);
		await expect(englishResult).toBeVisible();
		await englishResult.click();

		await expect(page).toHaveURL(/\/resources\/languages\/en\/?/);
		await expect(page.getByTestId("availableResource").first()).toBeVisible();

		const chapterBar = page.getByTestId("reader-chapter-picker");
		await expect(chapterBar).toHaveText(/Genesis\s*1/, { timeout: 30_000 });
		await openChapterPicker(page, chapterBar);

		const matthewHeader = page.locator('[data-accordionbook="Matthew"]');
		await matthewHeader.scrollIntoViewIfNeeded();
		await matthewHeader.click();

		// Scope chapter "28" to the Matthew accordion item
		const matthewChapter28 = page
			.locator("div")
			.filter({ has: page.locator('[data-accordionbook="Matthew"]') })
			.filter({
				has: page.getByRole("button", { name: "28", exact: true }),
			})
			.last()
			.getByRole("button", { name: "28", exact: true });
		await matthewChapter28.click();

		await expect(chapterBar).toHaveText(/Matthew\s*28/);
		await expect(page).toHaveURL(/chapter=28/);
		await expect(page.getByTestId("theText")).not.toBeEmpty();

		await page.getByTestId("reader-nav-next").click();
		await expect(chapterBar).toHaveText(/Mark\s*1/);
		await expect(page).toHaveURL(/chapter=1/);
		await expect(page.getByTestId("theText")).not.toBeEmpty();

		await page.getByTestId("reader-nav-prev").click();
		await expect(chapterBar).toHaveText(/Matthew\s*28/);
		await expect(page).toHaveURL(/chapter=28/);
		await expect(page.getByTestId("theText")).not.toBeEmpty();
	});
});
