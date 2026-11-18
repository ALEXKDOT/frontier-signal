# Frontier Signal Briefing redesign QA

Completed against the finished static build on 18 November 2026.

## Product

- [x] The hero describes a weekly public briefing for non-specialists.
- [x] Recent developments are the first substantive module.
- [x] Six featured updates expose every required preview field.
- [x] Evaluations and safeguards appear beside incidents.
- [x] The homepage does not render the exhaustive model catalog.
- [x] Control cases are newest-first by displayed report date.
- [x] Plain summaries are the default and the vocabulary toggle is absent.

## Evidence and data

- [x] Existing sources, dates, provenance, review labels, and evidence limits survive migration.
- [x] All 116 records use one of the five validated update types.
- [x] Featured selection is reproducible and validated.
- [x] All 78 glossary terms, 174 aliases, references, and related terms resolve uniquely.
- [x] Model-family summaries derive from source data.
- [x] The chart is explicitly labeled as collection records grouped by report date, not additions, prevalence, or risk.

## Accessibility and interaction

- [x] Keyboard users can open and dismiss record details.
- [x] Keyboard users can open, pin, enter, and dismiss glossary definitions.
- [x] Glossary cards stay on-screen at 320, 390, 768, 1024, and 1440px.
- [x] Record dialogs and pinned glossary cards restore focus.
- [x] The chart has a screen-reader table equivalent.
- [x] Standalone touch targets are at least 44px.
- [x] Reduced-motion mode leaves all content visible and suppresses interface motion.

## Responsive and visual

- [x] No primary route scrolls horizontally at 320px.
- [x] Mobile sections use natural height and do not clip content.
- [x] Light and dark themes retain readable colors and visible focus styling.
- [x] Update types use icon plus text; color is not the only distinction.
- [x] Screenshots were reviewed at 1440×900, 768×1024, and 390×844.

Final captures:

- [briefing-1440x900.png](./screenshots/briefing-1440x900.png)
- [briefing-768x1024.png](./screenshots/briefing-768x1024.png)
- [briefing-390x844.png](./screenshots/briefing-390x844.png)

## Regression

- [x] Legacy dashboard, timeline, and methodology routes resolve sensibly.
- [x] Updates search and taxonomy filters work.
- [x] The complete model catalog remains reachable.
- [x] Methods, source register, import provenance, and glossary remain reachable.
- [x] The npm run build command passes.

## Executed checks

- npm run build: 38/38 tests pass; both publication validators and JavaScript syntax checks pass.
- npm run test:ui: all browser checks pass at 1440, 1024, 768, 390, and 320px, including every primary route, overflow, popover bounds, focus return and visible focus rings, theme persistence, reduced motion, search/filter behavior, mobile-menu Escape, tap targets, legacy aliases, and runtime errors.
- Taste copy lint: 0 failures and 0 warnings.
- Taste performance check, three runs at 1440 and 390px: 0 failures and 0 warnings; 274.5 KiB transferred, FCP 112/48ms, LCP 220/196ms, and CLS 0.000/0.000.
- git diff --check: passes.

## Taste gate result

The three permitted Taste gate rounds ended GATE: OPEN 24. Five findings are explicitly waived:

- decorative software “moment” omitted to keep the evidence interface calm;
- natural-height Weekly Briefing;
- natural-height Control cases;
- natural-height Model map;
- compact Learn section.

The remaining automated findings are generic house-layout conflicts or false positives: they demand every section and footer be exactly one or two viewports, reject the handoff’s compact footer and centered closing invitation, interpret nested editorial columns as off-grid, and exclude data-ui-marked live interface copy when looking for the visible heading and actions. The supplied handoff explicitly requires content-driven mobile heights and a compact footer, so those findings were not used to reintroduce clipped or padded presentation-slide layouts. Browser QA, screenshots, contrast checks, performance, and the application test suite remain green.
