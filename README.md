# Accessibility kit

Three React + TypeScript components built to the [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) (APG), in an [Astro](https://astro.build) app, with WCAG 2.2 AA test coverage by [Playwright](https://playwright.dev) and [axe-core](https://www.deque.com/axe/axe-core/).

| Component  | Pattern                                                                                                         | Notes                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `Tabs`     | [Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)                                                          | Roving `tabindex`; focusable panel                                           |
| `Dialog`   | [Modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)                                          | Native `<dialog>` + `showModal()`; focus restored to the trigger             |
| `Combobox` | [Combobox autocomplete](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/) | Focus stays with the input; `aria-activedescendant` tracks the active option |

## Run it

The tests run locally in Google Chrome (`channel: "chrome"`), and the CI runs `npx playwright install --with-deps chrome`.

```sh
npm install
npm run test:a11y  # Playwright + axe-core
```

## Test coverage

Queries use [getByRole](https://playwright.dev/docs/locators#locate-by-role) with accessible names.

- **Keyboard contracts**: every key in each APG pattern, focus placement on open (restored on close), and inert page behind modal.
- **Automated WCAG scan**: axe-core with the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa` tags, run on interactive (and idle) states, plus color contrast in both light and dark schemes.

## Automation limits

Automated scan doesn’t verify screen-reader output, focus order beyond the tested paths, or non-text contrast such as focus rings and borders.

<!-- TODO: add your VoiceOver / NVDA notes here: what each component announces and anything surprising. -->
