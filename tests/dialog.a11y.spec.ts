import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const trigger = (page: Page) => page.getByRole("button", { name: "Delete project" });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Delete project?" });

const scanDialog = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page })
    .include("dialog")
    .withTags(WCAG_TAGS)
    .analyze();
  expect(violations).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Astro removes `ssr` from an island once React has hydrated; interacting earlier races the handlers.
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await expect(trigger(page)).toBeVisible();
});

test("has no axe violations while closed", async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
});

test("has no axe violations when open", async ({ page }) => {
  await trigger(page).click();
  await expect(dialog(page)).toBeVisible();
  await scanDialog(page);
});

test("whole page has no axe violations when open", async ({ page }) => {
  await trigger(page).click();
  await expect(dialog(page)).toBeVisible();
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
});

test("has an accessible description", async ({ page }) => {
  await trigger(page).click();
  await expect(dialog(page)).toHaveAccessibleDescription(
    "This permanently removes the project and its history.",
  );
});

test("closes on Escape and returns focus to the trigger", async ({ page }) => {
  await trigger(page).click();
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(trigger(page)).toBeFocused();
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
});
