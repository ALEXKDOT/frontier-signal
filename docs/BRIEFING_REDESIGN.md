# Frontier Signal Briefing redesign

Kind: software — a public, source-linked weekly frontier-AI briefing for non-specialists.

Deal: centred hero adapted to a factual edition summary; nav-mega dealt, then implemented as a flat full-screen mobile menu because the product has no appropriate navigation imagery; footer-dark adapted to a compact natural footer required by the product brief; close-type omitted as a separate screen; surface-pairs rhythm; tonal buttons; dots mark; word-highlight dealt but not used because it would decorate evidence copy. The existing cream, forest, and rust palette and Source Serif/Public Sans pairing are retained as client identity.

Voice: technical-dry — exact, not cold; sure, not loud; no humour. Sentences are generally 8–18 words, with longer sentences reserved for evidence limitations. The site's established nouns remain consistent: update, record, source, finding, interpretation, evidence limit, report date, occurrence date, and control case.

Main action: **Read this week’s briefing**.

## Product facts

- Frontier Signal explains important frontier-AI incidents, evaluations, safeguards, policy changes, and major model developments.
- The application is a dependency-free static site with no accounts, analytics, uploads, or backend.
- Existing research records, model data, source URLs, dates, provenance, review status, and uncertainty must survive the redesign.
- Record counts describe the collection. They are not incident rates, prevalence estimates, or risk scores.
- Plain language is the default. Technical detail and evidence limits are disclosed within each record.
- The complete evidence database remains accessible behind a concise weekly briefing.

## Page and route plan

The five primary user-facing destinations are:

1. Briefing — `?view=briefing`.
2. Updates — `?view=updates`.
3. Control cases — `?view=cases`.
4. Model map — `?view=models`.
5. Methods & sources — `?view=methods`.

Compatibility aliases remain for existing shared URLs:

- `dashboard` → Briefing;
- `timeline` → Updates;
- `catalog` → the complete model appendix;
- `methodology` → Methods & sources;
- `overview` → Risk Outlook;
- `ladder` → Concern Ladder.

Anchors such as `#models`, `#coverage`, `#glossary`, and source-linked record IDs must continue to resolve sensibly.

## Briefing section plan

### 1. Hero — one factual edition

Idea: say what the product is, who it is for, and when the evidence was checked.

Presentation: centred hero composition adapted into an editorial split. The headline and two actions occupy the left reading column; a compact edition summary occupies the remaining columns. The summary uses real record counts by update type and labels them as collection counts.

Content:

- headline: “The important developments at the frontier of AI—explained plainly.”;
- source-linked weekly briefing description;
- updated date and coverage period;
- primary action: Read this week’s briefing;
- secondary action: Browse all updates;
- compact update-type counts, never a risk score.

Height: may fill the first desktop screen when content fits. On tablet and mobile it uses natural height.

### 2. What changed this week — editorial updates

Idea: let a first-time reader name the important recent developments without opening a record.

Presentation: one dominant story and four to seven compact ruled briefs. Avoid a uniform card grid.

Every preview contains:

- report date;
- high-level update type with stable icon and text;
- short headline;
- self-contained plain summary;
- one restrained why-it-matters sentence;
- evidence-strength label;
- Read the evidence or direct-source action.

Technical detail, evidence limits, occurrence dates, provenance, review state, and the complete source stack open on demand.

Selection: explicit record data determines eligibility and order. Validation enforces the allowed count, newest-first ordering, unique IDs, and complete required fields. A stored editorial priority may break ties. The renderer must not contain an unexplained hard-coded ID list.

Height: content-driven at every width; single column on phones.

### 3. Records by report date — twelve-week visual

Idea: show whether recently reported records were mainly incidents, evaluations, safeguards, model changes, or policy records.

Presentation: twelve stacked weekly bars with a written legend. Each record is grouped by its displayed report or disclosure date because the historical collection does not record a reliable addition date. The chart uses counts only, does not animate, and does not imply severity. A semantic table provides the same week-by-type values.

Height: natural. At 320px all twelve bars remain inside the viewport; labels may be reduced to a subset of week markers, while the data table retains every value.

### 4. Latest control cases — chronological evidence reader

Idea: preserve and expand the strongest existing finding / interpretation / evidence-limits pattern.

Presentation: a newest-first case selector and one selected evidence reader. The selected case can include an ordered sequence:

`evaluation setup → observed behavior → boundary crossed → containment or response → known outcome`

Only sourced steps appear as known. Missing steps are labeled Unknown. The Hugging Face case must expose its finding, interpretation, evidence limits, occurrence date, and sources.

Height: content-driven. The selector and reader sit side by side on desktop and stack at tablet widths. The sequence becomes vertical on phones.

### 5. Model landscape — family-level comparison

Idea: let readers find each provider's current flagship family without scrolling through variants.

Presentation: one ruled row per provider with flagship family, practical family when distinct, access status, latest consequential change and date, and direct provider source. The complete searchable catalog remains available as a clearly labeled appendix.

Height: natural. The desktop table becomes label/value rows on phones, not a card wall.

### 6. Learn as you read — methods and glossary

Idea: make research methods and definitions easy to reach without repeating the primary navigation.

Presentation: one compact text block with links to Methods & sources and the full glossary. Inline definitions already demonstrate the glossary in context.

Height: natural and short; it may merge visually with the compact footer.

### 7. Footer — source context

Idea: close with the product promise and the paths a researcher needs.

Presentation: footer-dark deal adapted to a compact natural-height band. It contains the Frontier Signal identity, one evidence-limits sentence, source repository, Methods & sources, and import provenance. There is no separate full-screen close.

## Visual grammar

The established client identity takes precedence over a new palette deal:

- warm cream paper and near-white reading surfaces;
- forest ink and actions;
- rust for incidents and focus in light mode;
- charcoal-green dark surfaces with pale ink;
- Source Serif for editorial headlines;
- Public Sans for reading text, controls, metadata, tables, and charts;
- square or very small radii, fine rules, and no shadowed card wall.

Update types use stable icon-plus-text labels. Their restrained accent colors are incident rust, evaluation steel, safeguard forest, model ochre, and policy graphite. Color is never the only identifier.

Evidence strength uses descriptive labels: Primary report, Independent research, External investigation, or Imported — unverified. There are no scores or certainty meters.

## Glossary behavior

The glossary renderer annotates the first meaningful occurrence of each referenced term in a view. It matches canonical terms and unique aliases longest-first and does not annotate headings, links, dates, source titles, button labels, or existing controls.

Each inline term is a semantic button. Desktop hover and keyboard focus open a temporary card. Click pins or unpins it. Mobile tap pins it. Only one card is open at a time. Escape and outside click dismiss it, and a pinned card returns focus to its trigger.

The shared definition card is a non-modal dialog with the term, short definition, and Full glossary link. It stays within a 12px viewport inset and flips above or below the trigger. When the trigger is inside a native record dialog, the definition card must remain in the top layer and Escape must close it before the record dialog.

## Responsive override

The product brief overrides Taste's rigid one-screen/two-screen treatment on mobile. Sections use the height their content needs. No `100lvh` multipliers, clipped overflow, or fixed 1,688px content blocks are used.

Desktop uses a 1280px wrap with 80px outer margins at 1440px. Tablet uses 48px margins. Phones use 24px. Splits stack text first. Standalone touch targets are at least 44px. No component causes horizontal scrolling at 320px.

## Interaction and accessibility

- A skip link is the first focusable control.
- The fixed header is opaque, stable, and keyboard accessible.
- The mobile menu states its expanded state and closes on Escape or navigation.
- Light and dark controls use `aria-pressed`.
- Native record dialogs return focus to their triggers.
- Update icons are hidden from assistive technology when adjacent text carries the label.
- The records chart has a table equivalent.
- Focus remains visible in both themes and forced-color mode.
- Reduced motion leaves every item visible and usable.
- Updates search and filters announce result counts without moving focus.

## Implementation boundaries

- Keep the source catalog intact while deriving concise model summaries.
- Preserve all established evidence facts and URLs during schema normalization.
- Add validation for update taxonomy, featured selection, glossary references and aliases, control-case order, and derived model summaries.
- Remove the vocabulary preference and its local-storage key from the interface and code.
- Keep the light/dark preference only.
- Do not add a framework or external analytics.
