# Frontier Signal

Frontier Signal is a weekly briefing on frontier-AI incidents, evaluations, safeguards, policy changes, and model releases. Each record includes original sources, interpretation, and evidence limits.

[Public website](https://alexkdot.github.io/frontier-signal/) · [Source repository](https://github.com/ALEXKDOT/frontier-signal)

## Reading the briefing

The Briefing view shows a selected set of recent records. Every preview includes its update type, report date, summary, interpretation, and evidence type. Open a record for original sources, technical detail, occurrence dates, provenance, and evidence limits.

The six primary destinations are:

- **Briefing:** the weekly overview and its featured developments.
- **Updates:** every collection record, grouped by report week and searchable by date, type, topic, or signal.
- **Control cases:** major incidents and control failures, ordered by report date.
- **Concern ladder:** nine capability levels and the evidence supporting each level.
- **Model map:** provider and model-family context, with the complete catalog kept as an appendix.
- **Methods & sources:** methodology, source register, update history, import provenance, and glossary.

The Risk Outlook remains available as a secondary explanatory view. Existing shared links using `dashboard`, `timeline`, `catalog`, `overview`, `ladder`, or `methodology` continue to resolve.

## Evidence model

Each update belongs to one high-level type:

- incident;
- evaluation and research;
- safeguard and monitoring;
- model release and access;
- policy and governance.

Plain language is the default. Technical detail is progressively disclosed within a record, and inline glossary definitions explain specialist terms without taking the reader away from the current paragraph.

The interface preserves the distinction between a reported finding, Frontier Signal's interpretation, and the limits of the evidence. Report or disclosure dates remain separate from occurrence dates. Primary reports, independent research, external investigations, and historical imports retain distinct labels. Record counts describe the collection; they are not incident rates, prevalence estimates, or risk scores.

## Run locally

Node.js 20+ validates the project; Python 3 serves the local preview. The application has no runtime dependencies, accounts, secrets, or backend.

```sh
npm run build
npm run dev
```

Open `http://127.0.0.1:4173`. The files in `dist/` are authored source, not generated output.

## Repository structure

- `dist/index.html`: static application shell and metadata.
- `dist/assets/`: native JavaScript, CSS, motion, and self-hosted fonts.
- `dist/data/signals.json`: update records, evidence summaries, dates, provenance, corrections, and coverage mapping.
- `dist/data/models.json`: provider and model catalog with source links.
- `dist/data/glossary.json`: inline and full-glossary definitions.
- `editorial/`: weekly review process, templates, and internal records. This directory is not part of the public site.
- `scripts/`: schema validation and regression tests.
- `docs/BRIEFING_REDESIGN.md`: current product and interface implementation plan.

## Editorial maintenance

The weekly workflow is specified in [editorial/WEEKLY_UPDATE.md](editorial/WEEKLY_UPDATE.md). Featured briefing records are selected through explicit data fields and validation, not an unexplained list of IDs. New records require a high-level update type, a self-contained plain summary, evidence limits, resolved glossary references, source metadata, and review status.

Model-catalog freshness is tracked separately from incident and research coverage. The concise Model map is derived from the existing source catalog; it does not replace or discard historical model records.

Automated checks validate structure, dates, references, route invariants, review labels, and editorial completeness. They cannot establish whether an external claim is true or substitute for independent replication.

## Privacy and accessibility

Frontier Signal has no analytics, advertising, account system, uploads, tracking pixels, or third-party application runtime. Only the chosen light or dark theme is stored locally.

The interface uses semantic headings, a skip link, visible keyboard focus, native record dialogs, screen-reader equivalents for data visuals, and glossary definition cards that support hover, focus, click, tap, Escape, and outside-click dismissal. Reduced-motion mode leaves all content visible and usable.
