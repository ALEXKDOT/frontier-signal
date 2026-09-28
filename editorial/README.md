# Editorial workflow

The current `watch` edition is the user's explicitly requested import of an existing conversation. It preserves provenance, source limitations, and corrections. It does not claim independent human review or assign a reviewed risk rating.

## Imported conversation records

- Use `review.status: "imported"`, with null `reviewedBy` and `reviewedAt`.
- Set the outlook level to `Unrated`; use a factual evidence summary.
- Preserve the original citation. Label unrechecked chat reports rather than implying verification.
- Record publication/disclosure dates separately from occurrence dates. If only the conversation date is known, say so in `dateBasis`.
- Map every concrete claim to its message index in `coverage`; reuse IDs for repeated mentions. New forensic detail is an `update`, not another incident.
- Retain uncertain attribution, failed attempts, and counterevidence. Do not transform forecasts, illustrative mockups, or subjective probabilities into observed incidents.
- `corrections` records departures from the original chat. The public coverage view renders this reconciliation directly from the data.
- This exception covers the user-requested import. It does not authorize unattended publication of fresh AI-written research.

## New analysis and reviewed editions

1. Prepare new analysis in `editorial/drafts/` using `UPDATE_TEMPLATE.json`. Hosting serves only `dist/`.
2. A human checks original sources, dates, observation versus interpretation, limitations, and counterevidence.
3. After actual approval, set each record's review status to `approved` with the real reviewer and date. Never invent a sign-off.
4. Review the outlook independently; review all records before switching the whole edition to `reviewed`.
5. Run `npm run build`, review the change, and publish the exact checked source through Sites. Automatic GitHub-to-Sites publishing is not configured.

Validation checks required fields and provenance consistency; it cannot determine whether a claim is true or a reviewer is genuine. Repository owners retain publishing authority.
