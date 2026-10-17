import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

const input = (page: Page) => page.getByRole("combobox", { name: "Favorite fruit" });
const listbox = (page: Page) => page.getByRole("listbox", { name: "Favorite fruit" });

const scan = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  expect(violations).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Astro removes `ssr` from an island once React has hydrated; interacting earlier races the handlers.
  await expect(page.locator("astro-island[ssr]")).toHaveCount(0);
  await expect(input(page)).toBeVisible();
});

test("has no axe violations while closed", async ({ page }) => {
  await expect(input(page)).toHaveAttribute("aria-expanded", "false");
  await scan(page);
});

test("has no axe violations when open", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.press("ArrowDown");
  await expect(listbox(page)).toBeVisible();
  await expect(input(page)).toHaveAttribute("aria-expanded", "true");
  await scan(page);
});

test("has no axe violations with an active option", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Apricot" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(input(page)).toHaveAttribute("aria-activedescendant", /-option-1$/);
  await scan(page);
});

test("has no axe violations when filtered", async ({ page }) => {
  await input(page).fill("berry");
  await expect(page.getByRole("option")).toHaveCount(2);
  await expect(page.getByRole("status")).toHaveText("2 results available.");
  await scan(page);
});

test("has no axe violations with no results", async ({ page }) => {
  await input(page).fill("zzz");
  await expect(listbox(page)).toBeHidden();
  await expect(input(page)).toHaveAttribute("aria-expanded", "false");
  await scan(page);
});

test("has no axe violations after selecting an option", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input(page)).toHaveValue("Apple");
  await expect(listbox(page)).toBeHidden();
  await expect(page.getByTestId("combobox-result")).toHaveText("You picked Apple.");
  await scan(page);
});

test("selects with a click", async ({ page }) => {
  await input(page).focus();
  await page.keyboard.press("Alt+ArrowDown");
  await page.getByRole("option", { name: "Mango" }).click();
  await expect(input(page)).toHaveValue("Mango");
  await expect(input(page)).toBeFocused();
  await scan(page);
});

test("Escape closes the list, then clears the input", async ({ page }) => {
  await input(page).fill("pe");
  await expect(listbox(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(listbox(page)).toBeHidden();
  await expect(input(page)).toHaveValue("pe");
  await page.keyboard.press("Escape");
  await expect(input(page)).toHaveValue("");
  await scan(page);
});
