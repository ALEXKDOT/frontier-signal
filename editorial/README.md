# Editorial workflow

1. Put AI-assisted updates in `editorial/drafts/`, using `UPDATE_TEMPLATE.json`. Drafts never ship: hosting serves only `dist/`.
2. A human reviewer checks every claim against the original sources, distinguishes findings from inference, and records limitations and counterevidence. Avoid copying the brief's hypothetical incidents as news.
3. After approval, copy the note to `dist/data/signals.json` with `review.status: "approved"`, the actual reviewer, and the actual review date. Include the note in appropriate pathways.
4. For the first reviewed edition, review **all** notes and the outlook, then set `mode` to `reviewed`. Do not mix a live headline with unreviewed demonstration ratings. Update `asOf`, the outlook rationale, and evidence references. Do not invent sign-offs.
5. Run `npm run build`. Open a pull request. The validation workflow rejects reviewed releases without reviewer names, dates, or evidence references.
6. Merge only after human approval. Publishing to Sites currently requires an explicit Sites release from the pushed source. GitHub push-to-Sites publishing is not configured in this release.

The current release is a demonstration edition. Historical source summaries and illustrative judgments are clearly labeled. It is not an auto-updating risk service yet.

## Changes to an assessment
Record the prior outlook, the new outlook, new evidence, assumptions weakened/strengthened, remaining uncertainty, and the human review in the pull request. Keep positive evidence visible. “Unassessed” is preferable to inventing certainty for an uncovered pathway.

## Enforcement limits
The validator prevents missing review fields, not forged approval. Protect the default branch and require review by a real editor before publishing. Repository owners retain ultimate publishing authority.
