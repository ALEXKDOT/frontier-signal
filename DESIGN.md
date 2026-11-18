# Frontier Signal — research atlas

The interface combines the supplied editorial weather reference's paper surface, serif hierarchy, and restrained green with the compact selectors and evidence panels of the maritime references. It is a working research application: the layouts follow the content and remain compact enough for comparison and source reading.

`dist/assets/style.css` is the token and layout authority. The historical `.impeccable/design.json` describes an older design. The implementation keeps plain HTML, native JavaScript, self-hosted variable fonts, and the existing static deployment workflow.

## Reading modes and type

Light mode uses warm paper (`#f7f6f0`), near-white reading panels, dark green ink, and evergreen actions. Dark mode uses charcoal-green surfaces and sage actions. Signal direction retains distinct written labels and arrow symbols; concern uses rust/amber, safeguards green, and mixed signals neutral. Restricted model access remains explicitly labeled in red.

Source Serif provides editorial headings; Public Sans provides body copy and controls. Both fonts and their licenses already belong to the repository. Main paragraphs are 16–18px, metadata at least 13px, and standalone controls at least 44px high. Dashboard content uses a 1280px wrap with 80px desktop and 24px phone margins. Fine rules, small corner radii, and whitespace establish hierarchy.

Theme controls use `aria-pressed` and store `frontier-theme` locally. Light mode is the default. Simplified vocabulary is still independent, off by default, and stored under its existing key.

## Information architecture

The five destinations remain Dashboard, Outlook, Timeline, Ladder, and Methods. Desktop uses one fixed navigation bar. Phones and tablets use a full-height menu that retains every destination, theme controls, and the simplified-vocabulary switch.

The dashboard opens with a split editorial hero, direct links to models and outlook, and a product-scale collection index. The index derives all three signal counts from the current dataset and retains the completed assessment date. Its explicit collection-count limitation prevents the graphic being mistaken for a rate or risk score.

The model directory places five providers above two featured models. Catalog counts include supported and uncertain offerings under the existing definition; retired and announced-only entries stay excluded. Release dates, provider sources, availability, uncertainty, and provenance remain intact. “View all” opens a dedicated catalog route with search, category filters, result counts, and reset controls, so expanding hundreds of entries never changes the dashboard’s screen rhythm. The `#models` deep link focuses the directory.

Major cases use a selector and evidence reader. Findings, interpretations, and limits have separate labels. The other routes use the same type, controls, dividers, and semantic colors. Timeline rows emphasize the report date; occurrence dates remain separate. The concern ladder keeps filled, half-filled, and outlined evidence symbols. Methodology keeps its source register, disclosures, history, and glossary.

## Motion and accessibility

The two files in `dist/assets/motion/` are unmodified copies of Taste 2.5.1's micro-interaction layer. The paper/topglow background and liquid-type moment are also exact bundled Taste assets. Liquid type appears once, on the research-routes statement; phones and reduced-motion users receive its finished still. The briefing entrance runs once on initial loading, and controls and linked cards respond to hover and press. There are no simulated live updates or repeating data animations.

Native modal dialogs retain keyboard focus, Escape dismissal, trigger-focus restoration, and an always-available close control. Focus rings use a contrasting rust or peach. A skip link, persistent field labels, semantic headings, live result counts, `aria-current`, and `aria-pressed` remain. Forced-color and print styles are supported.

## Design guidance in context

Taste's landing-page defaults were adapted to the user's existing research application and supplied dashboard references. The dashboard now uses one- and two-screen sections, a dealt split hero, a statement footer, and one purposeful type moment. Promotional photography and decorative stock imagery were excluded because the live research interface is the product visual. Research limitations and chart context remain visible. No new research, model rankings, claims of continuous ingestion, human approvals, or risk probabilities were introduced.

The scoped request and review criteria are in `docs/ATLAS_REDESIGN.md`; validation evidence is in `docs/ATLAS_REDESIGN_QA.md`. Publishing the site or cloud environment is outside this change.
