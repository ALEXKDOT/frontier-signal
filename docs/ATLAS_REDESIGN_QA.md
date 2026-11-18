# Atlas redesign QA — Taste follow-up

## Final gate

`GATE: OPEN 1 (rounds used up)`

The gate reduced from 49 blocking findings in the first (stale-bundle) round to one open finding after three rounds. No waivers were added.

Open finding:

- `container-edges` at 1440px — `article#incident-spotlight` runs from x=515 to x=1360 inside the cases section. The checker asks any box wider than half the wrap to run from x=80 to x=1360 or be recognized as a row/split. This is the right-hand detail pane of the deliberate selector/detail research UI; it remains open because the gate exhausted its three rounds.

Non-blocking warnings retained by the final gate:

- The hero UI mock covers 22% of the section against the checker’s approximate 25% visual target.
- Navigation includes 15px destination labels and a 13px utility label.
- The six-word hero heading wraps to four lines at 1440px.
- The research-routes section contains 137 words, while the page average remains 57 words per screen.
- The signal labels below the evidence plot are interpreted as a visual caption.
- Three mobile footer links measure 40px rather than the checker’s 44px target.
- Mobile content-air measurements vary between the one-screen hero and two-screen directory/cases sections.

## Required Taste checks

- Layout check, 1440x900 and 390x844: **no findings**.
- Runtime moment check through the gate: `moment-none` **PASS**; liquid-type mounts once and has phone/reduced-motion still behavior.
- Kit integrity: bundled `backgrounds.css`, `backgrounds.js`, moment loader, moment library, and liquid-type JS/CSS are byte-for-byte identical to the installed Taste skill.
- Copy gate: no blocking copy-lint finding; headline names frontier AI and clinical leaders, and the first screen includes the hard fact of 116 records.
- Performance, three runs at 1440 and 390: **0 FAIL, 0 WARN**.

## Performance summary

| Metric | 1440px | 390px |
| --- | ---: | ---: |
| Transfer | 291.2 KiB | 291.2 KiB |
| Requests | 17 | 17 |
| Median FCP | 280 ms | 140 ms |
| Median LCP | 444 ms | 308 ms |
| Blocking time | 14 ms | 2 ms |
| Layout shift | 0.000 | 0.000 |
| WebGL peak | 0 | 0 |
| Broken requests | 0 | 0 |

The CPU browser reported one long task at each size, below budget, and no unmounted modules.

## Repository and data validation

- `npm run check`: **PASS** — 116 research notes, six pathways, all sources, publication gates, five providers, and 241 model records validated.
- `npm run build`: **PASS** — all 23 Node tests passed.
- Research and model data files were not changed in this pass.
- `node --check dist/assets/app.js`: **PASS**.
- Final Open Graph image: `dist/share.jpg`, 1200x630 JPEG.

## Responsive review

Taste screenshots were inspected at 1440x900, 1024x768, 820x1180, 768x1024, and 390x844. The desktop dashboard uses four one-screen sections plus a one-screen closing statement. The phone directory, cases, and research-routes sections use two screens; the hero remains one screen. The 320px fallback hides the compact hero evidence panel to prevent collisions while retaining its model and outlook actions.

## Functional coverage

- Query-based routing replaces ambiguous cross-view hash links and retains deep anchors.
- The fixed navigation collapses before labels collide, and its menu exposes theme and vocabulary controls.
- Provider and control-case selectors preserve `aria-pressed` state.
- Full model catalogs open on a dedicated route with search and category filtering; dashboard height never changes.
- Dialog focus restoration, Escape dismissal, theme persistence, simplified vocabulary, timeline filtering, and source links remain wired.
- No deployment or publication action was performed.
