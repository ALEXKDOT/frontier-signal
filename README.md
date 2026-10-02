# Frontier Signal

A public dashboard of frontier AI incidents, research, and governance developments.

[Public website](https://alexkdot.github.io/frontier-signal/) · [GitHub](https://github.com/ALEXKDOT/frontier-signal)

## Current edition

Imported September 28, 2026 from the user-supplied [Frontier AI Risk Watch conversation](https://chatgpt.com/share/6abaacac-158c-83e8-ad6b-c957ed9fd3a3), covering substantive watch updates through September 27. The site contains 64 records: 59 added during reconciliation and the original five historical research notes. Records include incidents, grouped reports, follow-up investigations, capability research, and governance—not 64 distinct breaches.

Every concrete development named in the watch updates is mapped in `signals.json` → `coverage` and the public Conversation coverage page. Repeated mentions link to the same records. Occurrence dates are separate from disclosure dates. The Medicare and AIHW cases remain separate; the September Hugging Face reconstruction is a follow-up to July's incident. Future scenarios and subjective forecasts are not counted as observed events.

The edition is an **AI-assisted conversation import, pending human editorial review**. Of the 59 additions, 34 use checked primary reports, nine use external investigations with attribution limitations, and 16 preserve chat reports whose original citations were not fully rechecked. Source verification is not independent replication or human sign-off. There is no reviewed risk score. Weekly source review and automatic publication are active, with the first scheduled review on October 5, 2026. The original chat remains a fixed historical import.

## Features

- Separate Dashboard, Overview, Timeline, Concern ladder, and Methodology views; AI Landscape is the default Dashboard
- Five company selectors, two featured models per company, and expandable source-linked model catalogs with availability and check dates
- Major incidents with observed behavior, implications, and evidence limits

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
- `dist/data/models.json`: neutral model catalog, provider sources, availability, and update history
- `dist/assets/`: native JavaScript and CSS
- `editorial/`: review process and draft template; not publicly hosted
- `scripts/`: data validation and regression checks
- `.github/workflows/check.yml`: validation on pushes and pull requests
- `.github/workflows/pages.yml`: validate and deploy `dist/` to GitHub Pages

## Updates and publication

The weekly workflow is specified in [WEEKLY_UPDATE.md](editorial/WEEKLY_UPDATE.md). Cadence: Mondays at 09:00 America/New_York. It independently researches material frontier AI developments and safety improvements using original reports and credible investigations. Each update explains evidence quality, the affected risk pathways, what changes the five-year outlook, counterevidence, and what would change the assessment next. The original AI Watch conversation supplied the analytical approach and historical import; neither its shared link nor its recurring task is needed for future updates.

The researcher also refreshes the neutral model catalog every Monday from official releases and lifecycle notices, preserving still-offered earlier versions and marking retirements. Model check dates are independent from incident coverage. The researcher reconciles duplicates, validates the data, and commits to this repository. GitHub Actions then validates and deploys `dist/` to GitHub Pages. New automated risk entries require source-check dates and a materiality rationale and cannot claim human review. The app separately tracks historical chat coverage and completed weekly checks.

**Activation status:** active following the user's explicit approval on October 2, 2026 for recurring unattended publication to the public website and GitHub. The scheduled task is `update-frontier-signal-weekly`, with the first scheduled review on October 5. No weekly review has completed yet. This task runs through the desktop execution host, which must remain available with the app running and its connections usable.

See [the editorial workflow](editorial/README.md). Imported editions cannot claim a reviewer or a reviewed risk rating. Reviewed editions require real approval metadata for every record and the outlook. Validation checks coverage references, source URLs, dates, and review labels; it cannot establish the truth of claims or prevent a dishonest sign-off.

GitHub Pages is the maintained public app. The `Publish Frontier Signal` workflow deploys on pushes to `main` and supports manual reruns. In repository Settings → Pages, the source is GitHub Actions. Only `dist/` is published; the website has no ChatGPT Sites runtime dependency. A failed build leaves the prior successful deployment available.

The earlier ChatGPT Sites publication and its separate local checkout are preserved as migration copies; weekly updates now target GitHub Pages only. The site remains available when the desktop app is closed, but Monday research requires the computer and desktop app to be running.

## Privacy

No accounts, analytics, uploads, or backend. Only the vocabulary preference is stored locally. The repository includes incident summaries and public citations, not a full transcript or unrelated personal conversation content. Drafts and files outside `dist/` are not hosted.
