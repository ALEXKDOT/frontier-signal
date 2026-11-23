# Weekly publication review — November 23, 2026

Automated source review for November 9–23, including the seven-day overlap from the last completed November 16 check. Integration starts from current main `fea530b3794ed3b641999a737e9edfa29fc9732a`, preserving its Briefing-first interface and schema version 2. No shared-chat monitoring or ChatGPT Sites publication was used.

## Evidence edition

Added eight records, with seven selected for the briefing: EU Commission data exposure; Together AI’s credential and prompt-data leak; Australia’s full incident review; METR’s quarterly capability measurements; GPT-6.2 safety evidence; OpenAI’s external-assessment agreements; California’s lawsuit; and Anthropic’s Anvil safeguard research. The November 12 Anvil study is overlap catch-up rather than a current-week lead. See the [incident source ledger](2026-11-23-incidents-research.md) for source verification and held candidates.

The five-year horizon is November 23, 2026–November 23, 2031. The overall concerning assessment is retained, with mixed incremental evidence: operational harm and stronger research capabilities coexist with implemented safeguards, remediation and more concrete external scrutiny. No selected evidence establishes irreversible loss of human control. A lawsuit is not a court finding, a signed assessment arrangement is not a completed audit, and a capability threshold is not a measured deployment-risk probability.

Together’s source supports a five-stage control case. Historical cases, including Hugging Face, remain. The concern ladder’s research stage links to the new METR study while retaining the distinction between assisted progress and autonomous recursion. All 116 previous records remain unchanged except the previous edition’s featured flags. Import dates, corrections and conversation coverage are unchanged. The collection now contains 124 records.

## OpenAI source reconciliation

Checked the [complete model catalog](https://developers.openai.com/api/docs/models/all), [API release notes](https://developers.openai.com/api/docs/changelog), [deprecations](https://developers.openai.com/api/docs/deprecations), [model release notes](https://help.openai.com/en/articles/9624314-model-release-notes), model pages and [pricing inventory](https://developers.openai.com/api/docs/pricing).

- Added [GPT-6.2 Astra](https://developers.openai.com/api/docs/models/gpt-6.2-astra) and [GPT-6.2 Sol](https://developers.openai.com/api/docs/models/gpt-6.2-sol), released November 17, and updated the featured pair. Earlier supported Astra, Sol, Terra and Luna versions remain. The [system card](https://deploymentsafety.openai.com/gpt-6-2-astra-sol), including November 22 clarifications, and [launch announcement](https://openai.com/index/introducing-gpt-6-2-astra-sol/) support the safety record. Developer-defined thresholds, tests with safeguards disabled, monitoring limitations and implemented controls are distinguished.
- Added [GPT-Live-1.1](https://developers.openai.com/api/docs/models/gpt-live-1.1) with November 19 **API release** metadata. Its earlier product/system-card date is not used as the API launch date.
- Added the [OpenAI CSAM Image Classifier](https://developers.openai.com/api/docs/guides/csam-classifier), offered to approved organizations from November 16. The card describes classification and human-review triage, with restricted availability.
- Corrected the existing Rosalind card to **GPT-5.5 Rosalind**, preserving its stable ID. The [June 3 version announcement](https://openai.com/index/introducing-new-capabilities-to-gpt-rosalind/) and [current access guide](https://help.openai.com/en/articles/20001193-gpt-rosalind-for-life-sciences-research) support its name and version-specific release. The previous April date referred to the family debut. GPT-6 Rosalind remains separately restricted.
- [Astra for Law 6.2](https://openai.com/index/astra-law-6-2/) and earlier Law configurations combine base Astra with legal tools/instructions. They are grouped with their base models, not counted as distinct underlying model versions. The provider scope note states this decision.
- Four older audio entries remain explicitly unconfirmed where catalog availability conflicts with later lifecycle dates. The review does not turn ambiguity into an inferred retirement. Regional fast-tier deprecations do not retire the whole GPT-5.2 or GPT-5.4 model.

## xAI and other providers

Reconciled xAI’s [model inventory](https://docs.x.ai/developers/models) against its [release notes](https://docs.x.ai/developers/release-notes). Grok Build 0.1 reached end of life November 19; it remains in historical data with retired status and is omitted from current offerings. The explicit lifecycle notice takes precedence over stale catalog pricing. Other xAI models and its featured pair remain unchanged.

The [Anthropic, Google and Meta ledger](2026-11-23-catalog-research.md) records their full catalog and retirement checks. Gemini 4 Neon is new, Genie 4 gains paid API availability, and transcription descriptions reflect voice editing. Anthropic and Meta lineups are unchanged. The published catalog has 246 stored entries, including 229 current directory entries; four of those have explicitly unconfirmed availability. All five provider reviews and model source-check dates are November 23. Historical catalog reviews remain intact.

## Validation and release controls

`npm run build` passes all source/provenance validators and 41 tests. Browser checks cover six primary views at 1440, 1024, 768, 390 and 320 pixels; report-week grouping, full record coverage, search, filters, glossary, dialogs, keyboard focus, theme, reduced motion, navigation and legacy route aliases are checked. No page overflow or runtime errors were found. Test expectations now follow actual report weeks and featured references while preserving historical-record checks. The browser harness brings its page forward after navigation to avoid a background-tab animation-frame stall observed on macOS.

Publication uses a commit based on the latest main tree, with an expected-head check and no force push. The exact commit’s Publish Frontier Signal workflow and the live bytes of all changed deployed files must both be verified before reporting publication. Release state and verification results are retained locally for idempotent retry.
