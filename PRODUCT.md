# Frontier Signal

<!-- impeccable:product-schema 1 -->

## Platform

Web. Dependency-free static HTML, CSS, and JavaScript hosted from `dist/`.

## Audience

Reasonably informed non-specialists who want to follow important frontier-AI developments without reading a research database. Readers need concise explanations, original sources, and clear evidence limits without being asked to choose a vocabulary mode first.

## Product purpose

Frontier Signal is a public, evidence-first weekly briefing. It helps a reader answer, quickly:

1. What important frontier-AI developments happened recently?
2. Was each one an incident, evaluation or research result, safeguard, model change, or policy change?
3. Why does it matter?
4. How strong is the source basis, and what does it not establish?
5. Where is the original source?

The briefing is the accessible front of an evidence database. The database remains available for research and provenance, but does not define the homepage experience.

## Primary information architecture

1. **Briefing** — the default weekly overview.
2. **Updates** — the complete searchable collection, grouped by report week.
3. **Control cases** — major incidents and control failures.
4. **Concern ladder** — nine capability levels with their current evidence status.
5. **Model map** — consequential provider and model-family changes.
6. **Methods & sources** — methods, source register, review history, import provenance, and glossary.

Risk Outlook is a contextual secondary view. The complete model catalog is an appendix reached from Model map. Previous route names remain aliases so shared links continue to work.

## Update taxonomy

Every record has one required high-level update type:

- `incident`
- `evaluation-research`
- `safeguard-monitoring`
- `model-release-access`
- `policy-governance`

Technical topics such as autonomy, containment, cyber, CBRN, model proliferation, monitorability, and AI R&D remain secondary tags.

## Briefing behavior

- The hero states that Frontier Signal is a source-linked briefing for non-specialists and reports the edition date and coverage period.
- The first substantive module contains no more than eight editorially important recent developments, newest first.
- The weekly selection includes different update types where the underlying records support that mix. Evaluations and safety research can appear beside incidents.
- Featured selection is data-driven and reproducible. Validation checks the selection fields, count, dates, and type coverage.
- Every preview shows its update type, report date, plain summary, why it matters, evidence or source type, and a route to the evidence.
- Technical detail, occurrence dates, evidence limits, all sources, provenance, and review status are progressively disclosed.
- Control cases are sorted by the displayed report or disclosure date. Any deliberately pinned case must be labeled without changing chronological order.
- The records-over-time graphic describes records added by update type. It never claims to measure risk, prevalence, or incident frequency.
- Updates renders every collection record exactly once, grouped into Monday-starting weeks by report or disclosure date.
- The homepage Current model families section shows one concise row per provider. The exhaustive catalog stays in the appendix.

## Evidence integrity

- Preserve source URLs, publishers, titles, report dates, occurrence dates, provenance, and review labels.
- Separate reported findings, site interpretation, and evidence limitations.
- Plain summaries are the default visible text. Technical detail never replaces or duplicates them in the preview.
- Primary reports are not described as independent confirmation.
- Historical imports and source-checked summaries remain distinguishable.
- Do not invent missing facts, human approval, rankings, probabilities, benchmark comparisons, or risk scores.
- Record counts are collection counts only.
- Model freshness and update-record freshness are tracked separately.

## Model map

The source catalog in `dist/data/models.json` remains intact. The main experience derives a concise row for each provider showing its current flagship family, practical family when distinct, access status, latest consequential change and date, and direct provider source. Retired releases, aliases, snapshots, modalities, and other variants remain searchable in the complete catalog appendix.

## Glossary

The glossary is based on terms that appear in the corpus. Each entry can include a label, aliases, category, short definition, useful example, and related terms. Every referenced term and alias resolves to exactly one entry.

The first meaningful occurrence of a relevant term in each view can open an inline definition card. The card supports mouse hover, keyboard focus, click to pin, mobile tap, Escape, and outside-click dismissal. It remains within the viewport and includes a link to the full glossary.

## Interface and accessibility constraints

- Preserve the cream, forest, and rust identity; Source Serif and Public Sans remain the type system.
- Update types use stable icons and color, always paired with text.
- Evidence strength is descriptive, never numeric.
- Mobile sections take the height their content needs. No forced one-screen or two-screen blocks create blank space or clip text.
- No horizontal scrolling at 320px.
- Standalone touch targets are at least 44px.
- Light and dark themes retain visible focus and readable contrast.
- Native record dialogs and glossary cards return focus appropriately when dismissed.
- Search and filters remain available on Updates.
- Reduced-motion mode preserves all information and interactions.

## Architecture and privacy

The site remains a static, analytics-free application with no accounts, uploads, backend, or client data collection. The light or dark theme is the only local preference. Old URLs and anchors resolve through explicit route aliases.

## Evidence on hand

`dist/data/signals.json`, `dist/data/models.json`, and `dist/data/glossary.json` contain the established records, source catalog, and definitions. Editorial files preserve sourcing and review context. A redesign may normalize these structures but must preserve their underlying facts and provenance.
