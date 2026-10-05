---
name: Frontier Signal
description: A reference handbook for reading the AI landscape and its evidence.
colors:
  paper: "#f5f4ee"
  surface: "#fffef9"
  sage-surface: "#e9ede5"
  ink: "#213a32"
  muted-ink: "#5d6b61"
  rule: "#cbd1c6"
  evergreen: "#183c34"
  evergreen-ink: "#f7f5e9"
  action: "#245c47"
  concern: "#8c491b"
  safeguard: "#246548"
  on-dark-action: "#dce7b0"
  on-dark-muted: "#cad8ce"
  on-dark-rule: "#547267"
  on-dark-safeguard: "#b8dcba"
  on-dark-concern: "#efc59a"
  available-surface: "#e7eee4"
  available-ink: "#30523c"
  conditional-surface: "#f4e8d8"
  conditional-ink: "#82420f"
  restricted-surface: "#f8e0e0"
  restricted-ink: "#a12132"
  field-border: "#aab7a6"
  placeholder: "#697369"
typography:
  display:
    fontFamily: "Source Serif, Georgia, serif"
    fontSize: "clamp(38px, 4.3vw, 58px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Source Serif, Georgia, serif"
    fontSize: "clamp(27px, 2.65vw, 36px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  featured-title:
    fontFamily: "Source Serif, Georgia, serif"
    fontSize: "clamp(26px, 2.7vw, 36px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  reading:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.9
  label:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.6
rounded:
  chip: "4px"
  field: "5px"
  disclosure: "6px"
  inset: "8px"
  surface: "12px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-6: "24px"
  space-8: "32px"
  space-12: "48px"
  space-16: "64px"
  gutter: "clamp(20px, 4.5vw, 72px)"
components:
  button-disclosure:
    textColor: "{colors.action}"
    rounded: "{rounded.disclosure}"
    height: "48px"
    width: "100%"
  button-disclosure-hover:
    backgroundColor: "{colors.sage-surface}"
  button-text:
    textColor: "{colors.action}"
    padding: "0"
    height: "36px"
  provider-default:
    textColor: "{colors.ink}"
    padding: "14px 20px"
  provider-selected:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.evergreen-ink}"
  navigation:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted-ink}"
  filter-selected:
    backgroundColor: "{colors.evergreen}"
    textColor: "{colors.evergreen-ink}"
    rounded: "{rounded.chip}"
    padding: "7px 12px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
    height: "44px"
  availability-default:
    backgroundColor: "{colors.available-surface}"
    textColor: "{colors.available-ink}"
    rounded: "{rounded.chip}"
    padding: "3px 8px"
  availability-conditional:
    backgroundColor: "{colors.conditional-surface}"
    textColor: "{colors.conditional-ink}"
    rounded: "{rounded.chip}"
    padding: "3px 8px"
  availability-restricted:
    backgroundColor: "{colors.restricted-surface}"
    textColor: "{colors.restricted-ink}"
    rounded: "{rounded.chip}"
    padding: "3px 8px"
  featured-model:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "20px 24px"
  record-reader:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "44px"
    width: "min(780px, calc(100% - 32px))"
---

# Design System: Frontier Signal

## Overview

**Creative North Star: "The Reference Handbook"**

Frontier Signal pairs a warm paper reading surface with an evergreen publication masthead. Serif headlines establish hierarchy; quiet sans-serif text keeps technical explanations, dates, and controls legible. Its audience includes physicians and MD/PhDs who need substantial explanations without assuming prior familiarity with AI.

The interface is compact at the point of orientation and spacious around evidence. Repeated facts use comparable fields, while longer interpretations use reading columns, horizontal rules, and explicit labels. The visual system is code-led: typography, CSS surfaces, and inline SVG provide its character without raster illustration or a separate image comp.

**Key Characteristics:**

- Warm paper, evergreen structure, and restrained semantic color.
- Serif editorial hierarchy with Public Sans controls and evidence text.
- Progressive disclosure with stable navigation and explicit source links.
- Flat reading surfaces, thin rules, and one elevated evidence reader.

This record was extracted from `dist/assets/style.css`, `dist/index.html`, and `dist/assets/app.js` on October 5, 2026. Frontmatter contains normative primitives; `.impeccable/design.json` holds motion, breakpoints, depth, component previews, and narrative. Existing research and methodology remain the content authority in `dist/data/` and `PRODUCT.md`.

## Colors

The palette combines warm ivory and softened green neutrals with a dark evergreen anchor. Token values are defined above; CSS custom properties remain the implementation source.

### Primary

- **Evergreen** (`evergreen`; CSS `--dark`) anchors the masthead, selected providers, selected filters, and the Overview assessment surface. **Evergreen ink** is its light foreground.
- **Action green** (`action`; CSS `--accent`) identifies links, focus outlines, active navigation rules, and interactive emphasis. The dark assessment surface switches to **on-dark action**, a pale lime, for readable emphasis.

### Secondary

- **Concern** and **safeguard** distinguish more concerning findings from safety signals. Their dark-surface variants are lighter and appear only within the dark Overview panel.
- **Availability colors** are a separate semantic system. Available, downloadable, and product-access labels use the green pair. Preview, retiring, and existing-user labels use the amber conditional pair. **Restricted access always uses the red restricted pair** and a heavier label weight.

### Neutral

- **Paper** is the page canvas; **surface** supports featured models, form controls, the navigation band, and the reader.
- **Sage surface** groups filters, selected incidents, evidence limitations, and stage details without adding elevation.
- **Ink**, **muted ink**, and **rule** establish the text and divider hierarchy. Muted text carries explanatory prose as well as metadata, so it must remain readable.
- **Field border** and **placeholder** distinguish editable controls. Dark panels use their own muted foreground and rule colors.

**The Labeled Status Rule.** Color always accompanies a written availability, evidence, or signal label. Restricted access is never reduced to a colored dot.

**The Separate Clocks Rule.** Show model source checks, completed incident reviews, and incident coverage as distinct dated facts. Their visual proximity must not imply continuous ingestion or identical freshness.

## Typography

**Display Font:** Source Serif, with Georgia and serif fallbacks. The self-hosted family name is `Source Serif`; the supplied license identifies the Source Serif 4 project.

**Body Font:** Public Sans, with sans-serif fallback. Controls inherit this family.

Source Serif makes section openings and model names feel like reference entries. Public Sans supports the higher information density of metadata, field labels, source notes, and multi-paragraph evidence. Dates and counts use tabular numerals where comparison benefits.

### Hierarchy

- **Display:** the main page title uses the fluid display token. At the narrow breakpoint it resolves to a fixed (40px); Timeline's section title uses (38px).
- **Headline:** section titles use the headline token. Specific editorial contexts use nearby sizes: incident index and methodology (32px), evidence-reader title (34px, line height 1.18), and incident spotlight (26–35px, line height 1.2).
- **Featured title:** the paired model names use the dedicated serif token; narrow screens use (30px).
- **Title:** sans-serif subsection titles use the title token. Full-catalog model names use (18px, line height 1.35).
- **Body:** the base token sets the reading rhythm; descriptions typically use (14px, line height 1.7). Methodology uses the reading token in a column no wider than (73ch). Incident facts and model descriptions stay near (65ch); dialog prose near (72ch).
- **Label:** short field labels use the label token. Navigation uses (13px), while availability and compact metadata use (11–12px). These compact sizes belong to short labels, not long explanations.

### Font assets and licensing

Both WOFF2 files are local assets in `dist/assets/fonts/`, preloaded in the document head and declared with `font-display: swap`. Public Sans is declared for weights (400–700); Source Serif for (400–600). The site makes no runtime font-provider request.

- `public-sans.woff2`: Public Sans project; upstream source identified by its bundled license is [uswds/public-sans](https://github.com/uswds/public-sans). License: SIL Open Font License 1.1, retained as `public-sans-OFL.txt`.
- `source-serif.woff2`: Source Serif 4 project; upstream source identified by its bundled license is [adobe-fonts/source-serif](https://github.com/adobe-fonts/source-serif). License: SIL Open Font License 1.1, retained as `source-serif-OFL.txt`.

## Layout

The page and masthead share a maximum width (1344px) and a fluid gutter defined by the frontmatter spacing token. Main content begins (32px) below navigation and ends with (72px) of breathing room. Section transitions commonly use (48px); component interiors use the smaller spacing scale. Borders are usually (1px), with a (2px) evergreen rule opening the incident section.

The dashboard places five provider buttons in one row, followed by two equal featured model columns with a (24px) gap. The expanded catalog uses three columns. Major incidents use a narrow index beside a broader evidence column, separated by a (56px) gap. The lower editorial section uses three columns. Timeline entries align dates on a fixed (64px) axis beside their text; Methodology uses a (200px) sticky contents column, a (64px) gap, and the constrained reading column. The concern ladder uses two columns with a sticky evidence detail.

### Responsive behavior

| CSS query | Implemented behavior |
| --- | --- |
| `min-width: 1500px` | Align the navigation's horizontal inset with the centered page container. |
| `max-width: 1100px` | Remove the masthead purpose line and provider counts; catalog becomes two columns; reduce large gaps and Methodology contents to (170px). |
| `max-width: 800px` | Allow navigation controls to wrap; stack the main title above two freshness facts; move incidents to one column with a three-item horizontal index; Methodology contents becomes an in-flow wrapping row; Overview stacks. |
| `max-width: 560px` | Keep all five navigation destinations and provider choices visible in equal columns; stack featured models, catalog, incident index, editorial columns, ladder, and glossary; use (16px) form text for search/select controls; reduce reader padding and remove sticky stage positioning. |

At the narrow breakpoint, main vertical padding becomes (28px) above and (48px) below. Timeline dates shrink to a (36px) axis with a (16px) gap. The dialog uses the viewport width minus (24px), padding (32px 24px), and a maximum height (92dvh); otherwise its maximum height is (90dvh).

## Elevation & Depth

Reading surfaces are flat. Surface tones, generous whitespace, thin borders, and type hierarchy supply structure. The evidence dialog is the only shadowed surface: its shadow (`0 24px 80px #10281d33`) and backdrop (`#142c24b3`) distinguish a temporary reading layer. Print removes this elevation.

**The Flat Reading Rule.** Reserve shadow for the modal evidence reader. Featured models, incident columns, timeline records, and navigation obtain hierarchy from borders, spacing, and tone.

Motion is limited to the provider's refreshed featured cards settling vertically (4px over 200ms, `cubic-bezier(.16,1,.3,1)`) and the vocabulary switch knob moving (180ms, `ease-out`). Reduced-motion preference disables animations, transitions, and smooth scrolling. No decorative looping movement is used.

## Shapes

The page is primarily rectangular and ruled. Large contained surfaces use the surface radius; limitation insets use the inset radius. Disclosure buttons, fields, and chips use progressively smaller radii from the frontmatter. Provider buttons and editorial records stay square. The vocabulary switch and dialog close control use round shapes to express their mechanics, not a general pill treatment for every control.

Action and informational icons are inline SVG strokes, typically (1em) with stroke width (1.6), hidden from assistive technology when adjacent text supplies their meaning. The masthead uses a separate simple bar-mark SVG. No raster assets are required.

## Components

### Buttons and links

Disclosure buttons are full-width, bordered controls with a minimum height (48px), centered label, and plus/minus indicator. Their height token records that minimum; it must not clip a wrapped label. Hover adds sage tone. Text actions use action green, an inline SVG, and underlining on hover; their common minimum height is (36px), with compact source links at (28px). Category filters use compact rounded rectangles and evergreen selection.

Interactive buttons, links, inputs, selects, and summaries receive a visible (2px) action outline with (4px) offset. Masthead focus uses the pale on-dark action color. Disabled buttons reduce opacity to (0.5) and use the disabled cursor. Do not infer unimplemented component variants from these states.

### Navigation

The persistent five-view navigation is Dashboard, Overview, Timeline, Concern ladder, and Methodology. The active destination uses stronger ink, heavier weight, a (3px) bottom rule, and `aria-current="page"`. Hash routing updates the page title and moves focus to the main region after subsequent navigation. Mobile retains every destination in view rather than introducing a menu drawer.

The adjacent Simplified vocabulary switch is off by default; explicit preference persists locally. It changes incident summaries in supported views while retaining access to terminology through the glossary.

### Provider selector and model directory

This is the signature interaction: choose a provider, compare the two featured offerings, then reveal the searchable catalog when needed. Provider buttons use `aria-pressed` and a named group. Selection replaces the featured pair and catalog provenance; it clears search and category filters. Expanded/collapsed state is remembered per provider for the current session.

Featured cards use the surface and radius tokens with a border. Role and availability sit above the serif model name; purpose follows; a divider leads to release date, release context, and provider source. Release references and model documentation remain separate links. Full-catalog entries become flat, top-ruled records so a large directory stays scannable.

The disclosure exposes a labeled search field, category select, polite live result count, and grouped catalog. Search matches all typed words across name, purpose, group, and availability. Empty results offer a filter reset. Collapsing from the bottom restores focus to the disclosure. Retired and announced offerings are excluded by the application's content rules.

### Availability and evidence labels

Availability chips use the default, conditional, and restricted variants in frontmatter. The restricted label is semibold and explicitly says “Restricted access.” Evidence labels and direction labels retain their own words; they are not interchangeable with model access status. Concern-ladder markers pair full, half-filled, or outlined circles with written evidence levels.

### Inputs and filters

Inputs and selects have persistent labels, surface fill, field-border stroke, small radius, and a minimum height (44px). The frontmatter height denotes this minimum. Placeholders supplement the visible label. Search and category controls sit within a sage filter region. On small screens, fields form a single column with larger control text. Timeline filters preserve a visible count and provide a clear action when filters are active; pagination adds records in batches of twenty.

### Incident evidence and reader

The incident selector updates an adjacent polite live region containing the reported finding, interpretation, and evidence limits. The source-linked reader keeps these distinctions and adds counterevidence, assessment-changing evidence, dates, and provenance. The presentation must not collapse those content roles into a single summary.

The native modal dialog has an accessible title and labeled close button. Opening focuses its close control; closing returns focus to the trigger when it still exists. Native Escape behavior and clicking the backdrop dismiss it. Definitions can be opened inside the reader and offer a return to the evidence. Body scrolling is locked while it is open.

### Accessibility and alternate rendering

The document declares English, includes a keyboard-visible skip link, uses semantic headings and definition lists, and marks decorative SVGs appropriately. Results and selections expose status via text and ARIA. Forced-colors mode preserves borders on key markers, outlines selected controls, and retains the active navigation rule. Print hides the masthead, footer, and reader controls and avoids splitting records where possible. These are implementation features, not a claim of a formal accessibility audit.

## Do's and Don'ts

### Do:

- **Do** use the paper, evergreen, serif, and sans-serif roles consistently across the five views.
- **Do** keep factual dates, availability, source links, and evidence limitations readable beside the claim they qualify.
- **Do** preserve explicit Restricted access text and its red semantic treatment.
- **Do** retain the provider-first, two-featured-model, expandable-catalog interaction.
- **Do** keep model freshness and incident freshness separate, and simplified vocabulary opt-in.
- **Do** retain keyboard focus, live result feedback, reduced-motion behavior, and visible state labels when extending components.
- **Do** retain the bundled font licenses and relative asset paths used by GitHub Pages.

### Don't:

- **Don't** replace written status or evidence levels with color alone.
- **Don't** add shadows to ordinary reading records or promote every editorial section into a raised card.
- **Don't** present featured models as independently benchmarked rankings or use source-check dates to imply human review.
- **Don't** change findings, provenance, methodology, or source meaning as part of a visual refinement.
- **Don't** introduce raster illustration or decorative movement without a new content need and an explicit design decision.
