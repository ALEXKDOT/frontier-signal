# Weekly Frontier Signal update

## Authorization and scope

On September 29, 2026 the user explicitly requested automatic weekly publication of the most relevant developments. The workflow is prepared, but automatic approval review blocked schedule creation pending explicit approval for recurring unattended publication to the public Site and GitHub. Do not activate or run this workflow until that approval is present in the task. Once approved, it supersedes the earlier restriction on unattended publication for this weekly workflow. Never invent human review: new automated records use `review.status: "automated"` with null reviewer fields and an actual `checkedAt` date.

The proposed scheduled task will run in this existing Codex task, Mondays at 09:00 America/New_York. It requires the task's connected sources, Sites and GitHub access, and execution host. It is not a browser timer or a cloud Site schedule. A saved schedule is not evidence that a run has completed.

## Find the existing project

Public Site: https://frontier-signal.akc-928.chatgpt.site/
GitHub: https://github.com/ALEXKDOT/frontier-signal
Site ID: `appgprj_6abaa3b7293481918b60719615c9b470`
Authoring checkout: `/Users/alexanderkrawec/.codex/.chatgpt-projects/g-p-6abaa2f8f0cc8191be327e5108a550d6/frontier-signal`

Read the current Sites building/hosting skills and open this same Site through its normal source workflow before edits. Preserve its public audience and project identity. Do not create another Site or discard intervening edits. If the checkout is unavailable, restore the Site source into a permitted empty directory. This plan is also retrievable from the public GitHub repository. Never store access tokens in this file, GitHub, the website, or automation prompts.

## Research and select

1. Read `dist/data/signals.json` and any incomplete release state. Start from `updates.lastCheckedAt` or `asOf`, with a seven-day overlap for delayed reporting. If a run was missed, catch up from that cursor rather than assuming the last seven days is sufficient.
2. Search the web and read original sources. Prioritize developer incident reports and system cards from OpenAI, Anthropic, Google DeepMind, Meta, and other relevant frontier developers; METR, UK AI Security Institute, US CAISI/NIST, Transluce, Apollo Research, and other credible independent investigations; and official government/regulatory publications. Use reputable reporting for discovery and corroboration. Do not treat search snippets, syndicated copies, model output, social speculation, or the old chat as verification of a new claim.
3. Select ordinarily 3–8 material developments, fewer when warranted. Do not fill a quota. Prioritize real impact, new mechanisms or capabilities, strength of evidence, scale, and whether a development changes a risk pathway. Include meaningful de-risking: effective controls, fixes, operational pauses, independent verification, and implemented governance. Skip routine product announcements without material safety relevance.
4. Cover autonomy, containment, cyber, monitorability/deception, AI-assisted AI R&D, model proliferation, CBRN, and governance. Distinguish human-directed misuse, authorized security research, evaluation incidents, and autonomous unauthorized actions. Keep biological/cyber descriptions non-operational.
5. Open and check every source supporting a new record. At least one accessible primary report or credible original investigation is required. If the evidence is insufficient, keep the candidate in `editorial/drafts/`; do not publish it merely to fill the weekly update. Identify attribution uncertainty and publisher conflicts. Never manufacture a source, date, reviewer, incident, or probability.

## Reconcile and edit

- Match by stable event identity, actors, mechanism, occurrence dates, and canonical source URLs. Update an existing record for corrections or additional detail; add a linked `kind: "update"` only when the new investigation warrants its own note. Never count repeated news coverage as another breach. Keep historical records and the original conversation coverage intact.
- Set each new record's `origin` to `weekly`, `chatMessages` to `[]`, `review` to `{ "status": "automated", "reviewedBy": null, "reviewedAt": null, "checkedAt": "YYYY-MM-DD" }`, and `verification` to `primary` or `research`. Give every source its real `checkedAt` date. Add `selectionReason` explaining the material change. Use the existing record schema and concise language.
- `date` is publication/disclosure date; `occurred` separately describes actual occurrence or uncertainty. Do not use a recent article date to make an old event look new. A follow-up must explicitly identify the older event.
- Keep `mode: "watch"` and `outlook.level: "Unrated"`. Update the factual evidence summary, latest note, pathway links, and ladder if the evidence warrants it. Do not label automated interpretation as human-approved. Do not repeat hardcoded claims about absent persistence/shutdown resistance if a future source supplies credible contrary evidence; make such claims record-specific and qualified.
- Preserve `chatAsOf` and `importedAt`. Set `asOf` to the date through which this completed review covers the evidence. Set `updates.lastCheckedAt` only after successful source review. Set `updates.lastPublishedAt` when preparing an actual release, never because the schedule exists.
- Append one `updates.history` entry for the review date with `addedIds`, `updatedIds`, and a concise `summary`. A no-material-change week may have empty ID lists and update freshness only. Do not claim complete coverage when sources were inaccessible; leave the cursor unchanged if research was materially incomplete.
- Keep Simplified vocabulary off by default and preserve the concise interface. This is a content-update task, not a recurring redesign.

## Validate, publish, synchronize

1. Run `npm run build`; it checks sources, provenance, date consistency, coverage, and review labels. Inspect the diff for unsupported claims, duplicate cases, incorrect years, broken references, or unrelated changes. Fix failures before any publication.
2. Use the existing Sites source workflow with a fresh short-lived credential, package the checked static `dist/`, save that exact pushed commit, and deploy the saved version. Preserve audience and confirm terminal success. Do not leave the update only in local files or a draft PR.
3. Synchronize changed files to `ALEXKDOT/frontier-signal` on its current main branch using connected GitHub tools. Read the latest head/tree first; create a tree based on that tree, a commit with that parent, and fast-forward the branch. Preserve unrelated files. If the branch moved, re-read and reconcile; never force-push.
4. Verify the saved source/version and GitHub file contents. A successful prior run has demonstrated this same publishing path; do not require an open app page or perform redundant production browsing to verify publication.
5. If a release partially completes, retain commit/version IDs in a local run note and retry the incomplete step idempotently. Do not duplicate records, create new schedules, or report a full success while either required destination is stale. On missing credentials, approval blocks, or failed publication, preserve the last good public content and identify the actual action required.
