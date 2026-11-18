# Research atlas redesign — validation

This change implements the supplied dashboard references using the installed Taste 2.5.1 design guidance and Matt Pocock implementation and code-review skills. The review baseline is `1a9fe17924943e7295799b36e026a65fe080d46a`, with the worktree compared against that baseline. The spec is [ATLAS_REDESIGN.md](ATLAS_REDESIGN.md).

## Application checks

- `npm run build`: passed data/schema validation, JavaScript syntax validation, and all 23 existing tests. The repository has no TypeScript typecheck.
- Data remains unchanged: 116 research records, six pathways, and 241 stored model entries across five providers. The current catalog definition presents 225 supported or uncertain offerings.
- Chromium interaction checks passed for all five provider selections, featured models, full catalogs, search, category filtering, reset, and collapse with focus return.
- The evidence index displays 54 concerning, 26 safety, and 36 mixed records. Each button opens the matching timeline filter and clears stale search/year/category filters.
- Timeline search, empty results, year/category filters, pagination, record source links, modal focus containment, Escape, and trigger focus return passed.
- Incident selection, glossary dialog, mobile ladder selection and return, and independent theme/vocabulary persistence passed. Simplified vocabulary remains off by default.
- Direct `#main` loading renders and focuses the dashboard; `#models` renders, scrolls to, and focuses the directory. All five main routes remain functional.
- All five views were checked at 1440, 1024, 820, 768, 390, and 320px in both themes: 60 layouts, one main h1 each, no horizontal overflow, and no browser warnings or errors during these flows.
- Reduced-motion checks passed for scrolling and custom hover transforms. Focus outlines, named controls, persistent input labels, native dialogs, and the skip link are retained. These checks are not a complete accessibility certification.
- `git diff --check` passed. The two vendored motion files match the installed Taste assets byte for byte. No runtime package dependency was added.

Browser scripts and captures are local review artifacts under `/tmp/frontier-redesign`; they are not shipped in `dist/`. Research claims and external source availability were not re-verified as part of this visual change.

Targeted follow-up checks confirmed the card hover moves 2px, reduced motion removes the transform, and the last provider/case selector fills its grid row at 390/820px. The performance audit identified a footer moving out of view as asynchronous data arrived. Reserving one viewport of height for the loading state fixes that transient layout shift without changing the loaded layouts.

Final screenshot inspection also led to a 24px gap between tablet navigation and the vocabulary control, aligned tablet provider counts, and explicit spaces in headings whose line breaks disappear on smaller screens. Focused browser assertions passed for those details at 1024, 820, 768, 390, and 320px, with no horizontal overflow.

The final Taste performance run passed with **0 failures and 0 warnings** at 1440 and 390px, using the median of three local loads. Each transferred approximately 263 KiB across 11 requests; measured layout shift was 0.000 with zero broken requests. Median local LCP was 160ms and 112ms respectively. These are local CPU-browser measurements, not field performance claims.

## Standards

The standards review found an undersized mobile weekly-review link and outdated privacy documentation. Both were fixed: standalone controls are at least 44px high, and README now describes local theme storage. The follow-up review reported no remaining documented-standard violations or actionable code-smell findings.

## Spec

The spec review found custom hover transforms that needed to respect reduced motion. These were fixed. It also identified the existing initial `#main` route bug; the dashboard now loads before focus moves to main. The follow-up review reported no missing requirements, implementation errors, or scope creep.

Final review findings: Standards 0; Spec 0. Both reviews were static; the browser checks above were performed separately.

## Taste audit

The full consistency audit was run at 1440, 1024, 820, 768, and 390px. Useful findings led to stronger muted-text contrast, a visible main focus indicator, larger mobile controls, and full-width final items in odd selector grids.

Taste also enforces a marketing-page composition: full-screen sections, one heading per screen, a particular container class, decorative imagery, and a closing conversion button. This application keeps content-sized reading panels, multiple navigable views, source text, and dense comparison controls as requested by the user. Its dynamic hash routes are checked by real navigation above; a static anchor-presence test reports them as missing. Small panel labels and large data numerals deliberately differ from the main section-heading scale.

The design gate is reported separately from passing application validation. No audit files or checker detection were added to application code, no skill files were modified, and no waivers were used. The final machine findings follow below.

The standalone five-size layout capture command failed inside the skill after capturing its first screen (`TypeError: r.sections is not iterable`, following the missing-container result). It did not complete and is not counted as a pass. The separate full consistency run, five-width screenshot capture, and 60-layout functional check did complete. The gate's two-size layout check reports the missing `.wrap` convention as an open finding.

### Final gate result

`GATE: OPEN 50 (rounds used up)`

Three rounds completed. No findings were waived. The full open list is retained below so this result is not mistaken for a clean design-gate pass. The final tablet-spacing and heading-whitespace corrections were checked separately after the third audit began.

1. **hero-fill** — section#models "The model directory"

   the next section shows on the first screen: it starts at 814px on a 900px screen (the hero ends at 779px)

   Checker recommendation: let the hero fill the first screen alone (min-height: 100svh, less above it): nothing of the next section on load

2. **nav** — header.site-header > div.masthead > a.edition-link "Weekly research review Mondays at 9:00 a"

   nav link wraps to a second line

   Checker recommendation: make the nav one bar from the content's left edge to its right edge, with every link and action inside it

3. **no-visual** — main#main > section.briefing.hero "A field guide to frontier AI."

   no picture, effect or mock in this section; a feature section needs a visual

   Checker recommendation: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits

4. **no-visual** — section#models "The model directory"

   no picture, effect or mock in this section; a feature section needs a visual

   Checker recommendation: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits

5. **no-visual** — main#main > section.incident-section "Where control was tested"

   no picture, effect or mock in this section; a feature section needs a visual

   Checker recommendation: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits

6. **text-only** — main#main > section.dashboard-bottom "From models to agents"

   the closing section is only text: no picture, icon, mock or effect in it

   Checker recommendation: give the section a visual: a photograph that fits, the real icons, or a UI fragment on a ground

7. **cta** — main#main > section.dashboard-bottom "From models to agents"

   the last section before the footer ends with no button

   Checker recommendation: add the action: a button in the hero, one on every priced item, one in the closing section

8. **copy-headings** — h2#evidence-index-title "The evidence index"

   "The evidence index" names no product, part, place or section (6 headings like it; at most one brand line per page) (and 5 more like it: "The model directory", "Where control was tested", "OpenAI agents compromise", "From models to agents", ...)

   Checker recommendation: name the thing in every heading: the product, a part, the place or a section noun

9. **heading-scale** — div#featured-models > article.model-card.card:nth-of-type(1) > div.model-card-head > h3 "GPT-6 Astra"

   an h3 at 32px, as large as the smallest h2 (17px) or larger (and 2 more like it: "GPT-6.1 Terra", "OpenAI agents compromise")

   Checker recommendation: size headings by level: the h1 largest, one size per level, each level below the one above

10. **heading-scale** — h2#directory-title "The model directory"

   h2 headings in 3 sizes, 17px ("The evidence index") to 36px (x2.12)

   Checker recommendation: size headings by level: the h1 largest, one size per level, each level below the one above

11. **heading-scale** — section.briefing.hero > aside.evidence-index > div.index-total > strong "116"

   the figure "116" is set at 76px, larger than the h1 (64.8px)

   Checker recommendation: set figures below the h1: a stat reads as data, not as the headline

12. **off-grid** — div.provider-sidebar > div.company-picker > button.company-choice:nth-of-type(2) > span.company-initial "A"

   left edge at 61px, 13px off the page margin at 48px (21 elements, like button.company-choice:nth-of-type(1)); 4 more in this section off the grid too (span.company-initial at 61px, span.company-initial at 61px, span.company-initial at 61px, p.small-note.provider-note at 60px)

   Checker recommendation: move it onto the page margin, or the column edge its section uses

13. **off-grid** — div.incident-picker > button:nth-of-type(2) > span:nth-of-type(1) > strong "Epoch / Trajectory"

   left edge at 64px, 16px off the page margin at 48px (21 elements, like button:nth-of-type(1)); 7 more in this section off the grid too (span:nth-of-type(1) at 64px, strong at 64px, span:nth-of-type(1) at 64px, strong at 64px, ...)

   Checker recommendation: move it onto the page margin, or the column edge its section uses

14. **links** — header.site-header > div.masthead > a.brand "FRONTIER SIGNAL."

   "FRONTIER SIGNAL." goes to #dashboard, which is not on this page

   Checker recommendation: point every link at a real section, page or file

15. **links** — header.site-header > div.masthead > a.edition-link "Weekly research review Mondays at 9:00 a"

   "Weekly research review Mondays at 9:00 a" goes to #weekly-updates, which is not on this page

   Checker recommendation: point every link at a real section, page or file

16. **links** — header.site-header > div.navigation-bar > nav > a.active "01 Dashboard"

   "01 Dashboard" goes to #dashboard, which is not on this page

   Checker recommendation: point every link at a real section, page or file

17. **links** — header.site-header > div.navigation-bar > nav > a:nth-of-type(2) "02 Overview"

   "02 Overview" goes to #overview, which is not on this page

   Checker recommendation: point every link at a real section, page or file

18. **links** — header.site-header > div.navigation-bar > nav > a:nth-of-type(3) "03 Timeline"

   "03 Timeline" goes to #timeline, which is not on this page

   Checker recommendation: point every link at a real section, page or file

19. **links** — header.site-header > div.navigation-bar > nav > a:nth-of-type(4) "04 Concern ladder"

   "04 Concern ladder" goes to #ladder, which is not on this page

   Checker recommendation: point every link at a real section, page or file

20. **links** — header.site-header > div.navigation-bar > nav > a:nth-of-type(5) "05 Methodology"

   "05 Methodology" goes to #methodology, which is not on this page

   Checker recommendation: point every link at a real section, page or file

21. **links** — section.briefing.hero > div.briefing-copy.hero-text > div.briefing-actions.btn-row > a.btn.btn--secondary "Read the outlook"

   "Read the outlook" goes to #overview, which is not on this page

   Checker recommendation: point every link at a real section, page or file

22. **links** — section.briefing.hero > div.briefing-copy.hero-text > div.briefing-update > a.text-link "Review completed Nov 16, 2026"

   "Review completed Nov 16, 2026" goes to #weekly-updates, which is not on this page

   Checker recommendation: point every link at a real section, page or file

23. **links** — div#company-models > div.catalog-provenance > a.text-link:nth-of-type(2) "Selection criteria"

   "Selection criteria" goes to #model-methodology, which is not on this page

   Checker recommendation: point every link at a real section, page or file

24. **links** — main#main > section.incident-section > div.section-head > a.text-link "View all records"

   "View all records" goes to #timeline, which is not on this page

   Checker recommendation: point every link at a real section, page or file

25. **links** — main#main > section.dashboard-bottom > article:nth-of-type(1) > a.text-link "Read the concern ladder"

   "Read the concern ladder" goes to #ladder, which is not on this page

   Checker recommendation: point every link at a real section, page or file

26. **links** — footer > div.footer-identity > a.footer-brand "Frontier Signal ."

   "Frontier Signal ." goes to #dashboard, which is not on this page

   Checker recommendation: point every link at a real section, page or file

27. **links** — footer > a:nth-of-type(2) "Import provenance"

   "Import provenance" goes to #coverage, which is not on this page

   Checker recommendation: point every link at a real section, page or file

28. **links** — footer > a:nth-of-type(3) "Sources & methodology"

   "Sources & methodology" goes to #methodology, which is not on this page

   Checker recommendation: point every link at a real section, page or file

29. **moment-none** — (the page)

   a software page (--type) deals no moment: every kind carries one, two on a long page (moments.md)

   Checker recommendation: deal one (moments.mjs pick --page software) and mount it in its own section

30. **hero-screen** — main#main > section.briefing.hero "Weekly research briefing A field guide t"

   the hero ends at 779px on a 900px screen, 121px above the fold: it ends at the fold, 1px either way (SR-1)

   Checker recommendation: make the hero exactly one screen (height: 100svh, its content fitted inside), never taller or shorter

31. **hero-screen** — section#models "Models & availabilityThe model directory"

   121px of the next section shows on the first screen (from 779px on a 900px screen): nothing below the hero shows at load (SR-1)

   Checker recommendation: end the hero at the fold so nothing of the next section shows at load (hero height: 100svh)

32. **section-height** — footer "Frontier Signal.Research and model catal"

   the section is 134px tall (0.1 screens), 766px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)

   Checker recommendation: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit

33. **section-height** — main#main > section.dashboard-bottom "CapabilitiesFrom modelsto agentsTool acc"

   the section is 446px tall (0.5 screens), 454px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)

   Checker recommendation: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit

34. **one-section** — main#main > section.incident-section "Cases & consequencesWhere control was te"

   the screen at scroll 1800px (stride 2) shows 430px of section 3 and the content of 2 sections, over 24px each beside section 4: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)

   Checker recommendation: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks

35. **one-section** — h2#directory-title "The model directory"

   the screen at scroll 196px (the top of section 1) shows 317px of section 2 and the heading of section 2 whole and the content of 2 sections, over 24px each beside section 1: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)

   Checker recommendation: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks

36. **one-heading** — h2#evidence-index-title "The evidence index"

   the hero holds an h2 (1): its heading is the h1, and an h2 opens the next section (SR-5)

   Checker recommendation: give each section one h2, first in its .wrap, and the hero only its h1

37. **one-heading** — main#main > section.dashboard-bottom > article:nth-of-type(2) > h2 "In the research file"

   the section holds 3 h2 headings: one per section, first in its .wrap (SR-5)

   Checker recommendation: give each section one h2, first in its .wrap, and the hero only its h1

38. **one-heading** — h2#directory-title "The model directory"

   headings of two sections show whole on one screen at 11 of 40 scroll positions (27.5%; at scroll 0, 50, 100, 150px), here with "The evidence index": at most 3% on a desktop (SR-5)

   Checker recommendation: make the sections one screen tall so their headings sit a screen apart and two never share one

39. **container-edges** — header.site-header "FRONTIER SIGNAL. A field guide tofrontie"

   the nav's content runs 48px from the left and 48px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (SR-6)

   Checker recommendation: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone

40. **container-edges** — main#main > section.briefing.hero "Weekly research briefing A field guide t"

   the content of section 1 runs 48px from the left and 48px from the right (read from its outermost blocks: no .wrap): the margin is 64-120px at 1440px (one container, equal margins, 2px either way) (and 4 more like it: "Models & availabilityThe", "Cases & consequencesWher", "CapabilitiesFrom modelst") (SR-6)

   Checker recommendation: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone

41. **container-edges** — a.skip "Skip to content"

   a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)

   Checker recommendation: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing

42. **container-edges** — header.site-header > div.navigation-bar "01 Dashboard02 Overview03 Timeline04 Con"

   a box runs 0-1440px, outside the container lines of the nav at 48-1392px: full width is for background layers and grounds only (SR-6)

   Checker recommendation: keep it inside the container lines (.wrap): full width is for background layers and grounds only

43. **container-edges** — main#main > section.dashboard-bottom > article.safeguard-reading > h2 "Safeguardsin practice"

   the h2 starts 989px right of the container's left: every h1 and h2 starts on it, 2px either way (SR-6)

   Checker recommendation: start the text on the container's left, or on the one split line every split shares

44. **container-edges** — h2#evidence-index-title "The evidence index"

   the h2 starts 811px right of the container's left: every h1 and h2 starts on it, 2px either way (and 3 more like it: "In the research file", x 300, x 60) (SR-6)

   Checker recommendation: start the text on the container's left, or on the one split line every split shares

45. **container-edges** — main#main > section.briefing.hero > div.briefing-copy.hero-text > div.briefing-update "Current assessmentResearch accelerates w"

   a box over half the container wide runs 48-750px, not on the container's lines at 48-1392px (and 2 more like it: "Primary-source reportRep", "View all 74 OpenAI model") (SR-6)

   Checker recommendation: run the picture or box from the container's left line to its right line, or put it in a row or a split

46. **row-lines** — div#featured-models "Most capableAvailableGPT-6 AstraOpenAI’s"

   a row of 2 items: its first item starts at 300px, the container's left line at 48px (2px either way) (SR-7)

   Checker recommendation: start the row's first item on the container's left line and end its last on the right line, every item one height

47. **row-gap** — div.directory-layout > div.provider-sidebar > div.company-picker > button.company-choice:nth-of-type(5) "xAI Grok 16 models"

   stretched alone across the last row (350px) while the 2 like it above are 171px

   Checker recommendation: fill the row at this width: span the columns, or stack the split

48. **no-visual** — main#main > section.dashboard-bottom "From modelsto agents"

   no picture, effect or mock in this section; a feature section needs a visual

   Checker recommendation: give the section a visual: a UI fragment on a ground, real icons, or a photograph that fits

49. **cta** — main#main > section.dashboard-bottom "From modelsto agents"

   the last section before the footer ends with no button

   Checker recommendation: add the action: a button in the hero, one on every priced item, one in the closing section

50. **container** — page

   no .wrap

   Checker recommendation: put the content in one .wrap
