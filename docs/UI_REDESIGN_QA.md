# UI redesign verification — October 5, 2026

The redesign applies [Impeccable](https://github.com/pbakaus/impeccable)'s hierarchy, typography, responsive layout, progressive disclosure, and accessibility guidance to the established Frontier Signal product. PRODUCT.md captures the user's requirements; DESIGN.md and .impeccable/design.json record the shipped system. This was implemented directly in code under the user's existing creative freedom.

## Scope

All five views, catalog controls, research dialogs, and mobile layouts were redesigned. Research datasets, editorial decisions, source-check dates, and the Monday update workflow were preserved. Fonts are self-hosted with their SIL Open Font License files. Versioned CSS/JS URLs prevent stale cached assets from mixing with the new shell.

## Verified

- `npm run build`: all 22 tests pass; 72 research records, six pathways, and 170 stored model entries validate.
- Provider selection and full-catalog expansion: 75 OpenAI, 16 Anthropic, 40 Google, 22 Meta, and 13 xAI currently offered entries. Every displayed model has a release-date field or explicit unavailable-date explanation.
- Catalog search, empty-result recovery, collapse, and per-provider selection work.
- All five views have no horizontal page overflow at 1280px desktop and 390px phone widths. Dashboard also checked at 320px and 768px.
- Timeline starts with 20 records. Load more reveals the next 20 and focuses the first newly revealed title. Search, year filtering, and clear filters work; 2025 returns six records.
- Incident detail dialogs open, dismiss with Escape, and restore trigger focus.
- Mobile concern-ladder selection brings the chosen detail into view, with a return-to-levels control.
- Release links expose their actual dates and release kinds in accessible names. Navigation focus, live result counts, reduced-motion styles, and forced-color outlines are present.
- Simplified vocabulary remains off by default. Model and incident freshness are displayed separately.
- Measured contrast: body 11.11:1; secondary text 5.09:1; restricted-access tags 6.02:1; masthead focus 9.28:1; assessment secondary text 8.20:1.
- No browser warnings or errors during the exercised flows.

## Review

An independent finish reviewer inspected desktop/mobile captures and source, then scored the fixes to mobile selection feedback, accessible release dates, masthead focus contrast, heading metadata, and SVG icons as resolved. The final disposition was **ship**, at the scope of those fixes. This is not a claim of exhaustive accessibility certification.

The Impeccable detector identified undersized masthead text (corrected) and inferred missing navigation padding. The latter was a static-analysis false positive: the rendered navigation uses the responsive `--gutter` inset. No global Impeccable installation or hook was added.

Publication is complete only when the exact commit's Publish Frontier Signal workflow succeeds and live assets match the checked files.
