# Frontier Signal — research atlas

The interface combines the supplied editorial weather reference's paper surface, serif hierarchy, and restrained green with the compact selectors and evidence panels of the maritime references. It is a working research application: the layouts follow the content and remain compact enough for comparison and source reading.

`dist/assets/style.css` is the token and layout authority. The historical `.impeccable/design.json` describes an older design. The implementation keeps plain HTML, native JavaScript, self-hosted variable fonts, and the existing static deployment workflow.

## Reading modes and type

Light mode uses warm paper (`#f7f6f0`), near-white reading panels, dark green ink, and evergreen actions. Dark mode uses charcoal-green surfaces and sage actions. Signal direction retains distinct written labels and arrow symbols; concern uses rust/amber, safeguards green, and mixed signals neutral. Restricted model access remains explicitly labeled in red.

Source Serif provides editorial headings; Public Sans provides body copy and controls. Both fonts and their licenses already belong to the repository. Main paragraphs are 16–18px, metadata at least 13px, and standalone controls at least 44px high. The maximum page width is 1440px, with common left and right edges and 48/32/20/16px responsive gutters. Fine rules, small corner radii, and whitespace establish hierarchy.

Theme controls use `aria-pressed` and store `frontier-theme` locally. Light mode is the default. Simplified vocabulary is still independent, off by default, and stored under its existing key.

## Information architecture

The five destinations remain Dashboard, Overview, Timeline, Concern ladder, and Methodology. Navigation wraps on phones and retains every destination.

The dashboard opens with a description of the tool, direct links to models and outlook, the current assessment, and its completed review date. Its evidence index derives all three signal counts from the current dataset, labels the numbers, and links each to the matching timeline filter. The explicit collection-count limitation prevents the graphic being mistaken for a rate or risk score.

The model directory places providers beside two featured models on desktop, then above them on smaller screens. Catalog counts include supported and uncertain offerings under the existing definition; retired and announced-only entries stay excluded. Release dates, provider sources, availability, uncertainty, and provenance remain intact. Full catalogs retain search, category filters, result counts, reset, and collapse. The `#models` deep link focuses the directory.

Major cases use a selector and evidence reader. Findings, interpretations, and limits have separate labels. The other routes use the same type, controls, dividers, and semantic colors. Timeline rows emphasize the report date; occurrence dates remain separate. The concern ladder keeps filled, half-filled, and outlined evidence symbols. Methodology keeps its source register, disclosures, history, and glossary.

## Motion and accessibility

The two files in `dist/assets/motion/` are unmodified copies of Taste 2.5.1's micro-interaction layer. The briefing entrance runs once on initial loading; controls and linked cards respond to hover and press. There are no simulated live updates or repeating data animations. Reduced motion shows the resting interface.

Native modal dialogs retain keyboard focus, Escape dismissal, trigger-focus restoration, and an always-available close control. Focus rings use a contrasting rust or peach. A skip link, persistent field labels, semantic headings, live result counts, `aria-current`, and `aria-pressed` remain. Forced-color and print styles are supported.

## Design guidance in context

Taste's landing-page defaults were adapted to the user's existing research application and supplied dashboard references. Whole-screen marketing sections, rotating collages, promotional photography, a single conversion action, and decorative scroll effects would obstruct this workflow. Research limitations and chart context remain visible. No new research, model rankings, claims of continuous ingestion, human approvals, or risk probabilities were introduced.

The scoped request and review criteria are in `docs/ATLAS_REDESIGN.md`; validation evidence is in `docs/ATLAS_REDESIGN_QA.md`. Publishing the site or cloud environment is outside this change.
