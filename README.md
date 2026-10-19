# Accessibility

Three React + TypeScript components built to the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/), in an Astro app, with WCAG 2.2 AA checks and keyboard behavior enforced in CI by Playwright and axe-core.

| Component  | Pattern                                                                                                                   | Notable decisions                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `Tabs`     | [Tabs, automatic activation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                              | Roving `tabindex`; Left/Right (wrapping), Home/End; focusable panel                                                                      |
| `Dialog`   | [Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                                    | Native `<dialog>` + `showModal()` for inertness and top layer instead of a hand-rolled focus trap; focus restored to the trigger         |
| `Combobox` | [Combobox with list autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/) | DOM focus stays in the input; `aria-activedescendant` tracks the active option; a `role="status"` live region announces the result count |

The components live in `src/components/`. `src/islands/` wraps each one with the demo content and CSS modules, and `src/pages/index.astro` renders all three.

## Run it

Requires Node 22.12 or newer.

```sh
npm install
npm run dev        # demo page at http://localhost:4321
npm run test:a11y  # Playwright + axe-core
```

The tests run in Google Chrome (`channel: "chrome"`), so Chrome must be installed locally. In CI the workflow runs `npx playwright install --with-deps chrome`. Playwright starts the dev server itself, or reuses one already running on port 4321.

## What the tests prove

Each component has one spec in `tests/`:

- `tests/tabs.a11y.spec.ts`
- `tests/dialog.a11y.spec.ts`
- `tests/combobox.a11y.spec.ts`

- **Automated WCAG scan:** axe-core with the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa` tags, run on interactive states and not just the page at rest: dialog open, listbox expanded with an active option, filtered and empty results, and tabs after selection and keyboard navigation.
- **Color contrast in both color schemes:** `color-contrast` is part of the `wcag2aa` tag. `playwright.config.ts` defines a `chromium` project (light) and a `chromium-dark` project (`colorScheme: "dark"`), and every spec runs in both. The palette comes from the CSS custom properties in `src/assets/global.css`, which are overridden under `prefers-color-scheme: dark`.
- **Keyboard behavior:** a few key paths per component, such as `End` in Tabs, `ArrowDown`, `Enter`, `Alt+ArrowDown` and `Escape` in the Combobox, and `Escape` closing the Dialog with focus returned to the trigger.
- **Inert background:** while the Dialog is open, the controls behind it can't take focus and Tab never lands on them.

Queries use `getByRole` with accessible names, so a test fails if a role or name regresses even when the markup still looks right.

## What automation doesn't cover

axe catches roughly a third to half of WCAG issues. It doesn't verify screen-reader output, focus order beyond the tested paths, or non-text contrast such as focus rings and borders.

<!-- TODO: add your VoiceOver / NVDA notes here: what each component announces and anything surprising. -->
