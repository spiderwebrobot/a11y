import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const tablist = (page: Page) =>
  page.getByRole("tablist", { name: "Account settings" });

const scanTabs = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page })
    .include('[role="tablist"]')
    .include('[role="tabpanel"]')
    .withTags(WCAG_TAGS)
    .analyze();
  expect(violations).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Astro removes `ssr` from the island once React has hydrated; interacting earlier races the handlers.
  await page.locator("astro-island:not([ssr])").first().waitFor({ state: "attached" });
  await expect(tablist(page)).toBeVisible();
});

test("has no axe violations on load", async ({ page }) => {
  await scanTabs(page);
});

test("has no axe violations after selecting another tab", async ({ page }) => {
  await tablist(page).getByRole("tab", { name: "Security" }).click();
  await expect(page.getByRole("tabpanel", { name: "Security" })).toBeVisible();
  await scanTabs(page);
});

test("has no axe violations after keyboard navigation", async ({ page }) => {
  await tablist(page).getByRole("tab", { name: "Profile" }).focus();
  await page.keyboard.press("End");
  await expect(tablist(page).getByRole("tab", { name: "Billing" })).toBeFocused();
  await scanTabs(page);
});

test("whole page has no axe violations", async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
});
