# Frontier Signal

A public dashboard of frontier AI incidents, research, and governance developments.

[Public website](https://frontier-signal.akc-928.chatgpt.site) · [GitHub](https://github.com/ALEXKDOT/frontier-signal)

## Current edition

Imported September 28, 2026 from the user-supplied [Frontier AI Risk Watch conversation](https://chatgpt.com/share/6abaacac-158c-83e8-ad6b-c957ed9fd3a3), covering substantive watch updates through September 27. The site contains 64 records: 59 added during reconciliation and the original five historical research notes. Records include incidents, grouped reports, follow-up investigations, capability research, and governance—not 64 distinct breaches.

Every concrete development named in the watch updates is mapped in `signals.json` → `coverage` and the public Conversation coverage page. Repeated mentions link to the same records. Occurrence dates are separate from disclosure dates. The Medicare and AIHW cases remain separate; the September Hugging Face reconstruction is a follow-up to July's incident. Future scenarios and subjective forecasts are not counted as observed events.

The edition is an **AI-assisted conversation import, pending human editorial review**. Of the 59 additions, 34 use checked primary reports, nine use external investigations with attribution limitations, and 16 preserve chat reports whose original citations were not fully rechecked. Source verification is not independent replication or human sign-off. There is no reviewed risk score and no unattended connection to the original chat.

## Features

- Searchable timeline with category, year, and signal-direction filters
- Separate report dates, occurrence dates, source types, and limitations
- Six evidence-linked risk pathways and a nine-stage concern ladder
- Per-record explanations, source register, and conversation coverage reconciliation
- Simplified vocabulary preference, off by default
- Responsive layout and keyboard-accessible native dialogs

## Run locally

Node.js 20+ validates the project; Python 3 serves the preview. No application dependencies or secrets are needed.

```sh
npm run build
npm run dev
```

Open `http://127.0.0.1:4173`. `dist/` is the authored static website, not generated output.

## Structure

- `dist/data/signals.json`: records, evidence summaries, provenance, corrections, and coverage mapping
- `dist/data/glossary.json`: vocabulary definitions
- `dist/assets/`: native JavaScript and CSS
- `editorial/`: review process and draft template; not publicly hosted
- `scripts/`: data validation and regression checks
- `.github/workflows/check.yml`: validation on pushes and pull requests
- `.openai/hosting.json`: existing Sites identity and static directory

## Updates and publication

See [the editorial workflow](editorial/README.md). Imported editions cannot claim a reviewer or a reviewed risk rating. Reviewed editions require real approval metadata for every record and the outlook. Validation checks coverage references, source URLs, dates, and review labels; it cannot establish the truth of claims or prevent a dishonest sign-off.

GitHub-to-Sites automatic deployment is not configured. Sites releases explicitly publish a checked source commit. This import does not create a new monitoring automation.

## Privacy

No accounts, analytics, uploads, or backend. Only the vocabulary preference is stored locally. The repository includes incident summaries and public citations, not a full transcript or unrelated personal conversation content. Drafts and files outside `dist/` are not hosted.
