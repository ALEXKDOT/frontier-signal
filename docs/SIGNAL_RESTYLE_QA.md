# Signal restyle verification — October 13, 2026

Visual verification was completed with the local preview at http://127.0.0.1:4174/. The user approved the restyle and requested publication to the existing GitHub Pages site on October 13, 2026.

## Scope

All five screens, provider catalogs, incident selectors, timeline controls, concern-ladder details, methodology disclosures, glossary, and evidence dialogs use the Signal visual system. Application data and editorial files are unchanged. The only application-logic edit aligns the ladder's focus/reveal breakpoint with the new 850px stacked layout. Theme metadata, favicon colors, and asset cache versions were updated; unused font preloads were removed.

The supplied desktop/mobile reference screenshots and both reference CSS files were inspected. The reference was translated into native HTML/CSS components; no dependencies were added. Existing availability color pairs and evidence symbols remain meaningful and labeled. This project has no maps or plotted charts.

## Automated project checks

`npm run build` passed: validation of 80 research records, six pathways, all source references, five providers and 216 stored model entries; JavaScript syntax check; all 22 existing tests. `git diff --check` passed. No research data, source text, editorial rules, or publication settings changed.

## Browser layout checks

All five main views were rendered at each width below, measured through the DOM, and captured at desktop and phone widths. Browser zoom was normalized before exact-width checks.

| Width | Dashboard | Overview | Timeline | Concern ladder | Methodology |
| --- | --- | --- | --- | --- | --- |
| 320px | Pass | Pass | Pass | Pass | Pass |
| 390px | Pass | Pass | Pass | Pass | Pass |
| 768px | Pass | Pass | Pass | Pass | Pass |
| 1440px | Pass | Pass | Pass | Pass | Pass |

Every row passed page-width and descendant-bound checks, retained all five destinations, and had no standalone controls shorter than 44px. Inline definitions and prose links retain inline text flow. Dialogs were checked at all four widths and had no horizontal overflow.

The desktop and mobile captures were visually inspected, including the full mobile dashboard and keyboard-focused evidence reader. Content remains in logical reading order; columns collapse at tablet sizes. Semantic full, half-filled, and outlined evidence circles remain intact.

## Interaction and accessibility checks

- All five providers expose the expected current catalogs: 77 OpenAI, 17 Anthropic, 72 Google, 32 Meta, and 13 xAI offerings.
- Mobile catalog expansion, empty search, reset, and collapse work for each provider. Collapse returns focus to the disclosure.
- Catalog category filtering works; restricted-access labels retain their original red palette. The expanded restricted catalog also fits at 320px.
- Each of the three incident selectors updates its evidence readout. Simplified vocabulary toggles and was restored to off.
- Keyboard activation opens the native evidence dialog and focuses its close control. Reverse tab remains inside; Escape dismisses and restores the trigger.
- Timeline empty results and reset, year filtering, category filtering, and signal-direction filtering work. The 2025 filter returns six records; safety returns 19 records, all labeled Safety signal.
- Pagination changes 20 visible records to 40 and focuses the first new record.
- At 768px, keyboard selection of a ladder level focuses the evidence panel, and the return control restores the selected level's focus.
- Methodology anchors, keyboard source disclosures, and glossary dialogs work.
- Reduced-motion emulation yields `scroll-behavior: auto` and a zero-duration switch transition. Emulation was cleared afterward. Forced-color fallback rules were retained in source.
- No warnings or errors were recorded by the browser during the exercised flows.

## Contrast and focus

Rendered text/background pairs across all five views passed WCAG AA text contrast thresholds. Representative ratios:

| Pair | Ratio |
| --- | --- |
| Primary text / panel | 14.52:1 |
| Secondary text / panel | 8.68:1 |
| Secondary text / selected charcoal | 6.65:1 |
| Coral text / panel | 6.08:1 |
| Dark text / coral action | 7.01:1 |
| Restricted access badge | 6.02:1 |
| Control border / panel | 4.01:1 |
| Control border / selected charcoal | 3.07:1 |
| Focus / panel | 9.25:1 |
| Focus / selected charcoal | 7.09:1 |

Keyboard inspection confirmed `:focus-visible`, a 3px `#FFB5A4` outline, and a 3px offset. This is a scoped visual and interaction check, not a comprehensive accessibility certification.

## Review artifacts

Screenshots and raw browser-check results are saved outside the repository at `../../artifacts/signal-review/` relative to this document:

- `dashboard-desktop.jpg`: full 1440px dashboard.
- `dashboard-mobile.jpg`: 390px phone viewport.
- `dashboard-mobile-full.jpg`: complete phone dashboard.
- `{dashboard,overview,timeline,ladder,methodology}-{1440,390}.jpg`: ten screen captures.
- `dialog-desktop.jpg`, `dialog-focus-320.jpg`, and `ladder-keyboard-768.jpg`: interaction and focus captures.
- `layout-checks.json`, `contrast-checks.json`, and `interaction-checks.json`: measured results.

Two preliminary PNG captures remain but are not final review artifacts. Use the JPG captures listed above.
