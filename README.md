# Frontier Signal

**What changed in frontier AI, how much it matters, and why.**

A public, evidence-first risk intelligence interface for readers without a technical AI background. It emphasizes uncertainty, original sources, and the distinction between findings and interpretation.

[Public website](https://frontier-signal.akc-928.chatgpt.site) · [GitHub](https://github.com/ALEXKDOT/frontier-signal)

## Release status

This is a **research preview**, with five linked reports from February–August 2025. The overall outlook and pathway statuses are illustrative. They are not a current risk advisory and have not been approved as a live editorial assessment. No existing ChatGPT task or automation is connected.

## Experience

- Explainable qualitative outlook with evidence and conditions that would change it
- Six risk pathways with plain-language explanations and explicit limitations
- Filterable research timeline and parallel capability/risk and safety/control signals
- Four-part interpretation layer for every event
- “How worried should I actually be?” explanations
- Nine-stage interactive concern ladder, with source-set-specific evidence labels
- Inline jargon definitions and persistent Simplified vocabulary preference (off by default)
- Methodology, source register, and observed/inferred/speculative evidence board
- Responsive layouts, semantic controls, keyboard-accessible native dialogs, reduced-motion support, and a skip link

## Run locally

Requires Node.js 20+ for validation and Python 3 for the local preview. There are no application dependencies or secrets.

```sh
npm run build
npm run dev
```

Open `http://127.0.0.1:4173`. The app uses native ES modules, CSS, and structured JSON. `dist/` is the authored static website; it is not generated output. Hash navigation works on static hosts and under a repository subdirectory.

## Structure

```text
dist/
  index.html
  assets/app.js        # Rendering, routing, accessible interactions
  assets/style.css     # Responsive visual system
  data/signals.json    # Versioned event records, pathways, outlook
  data/glossary.json   # Plain-language definitions
editorial/            # Draft template and human review workflow (not published)
scripts/              # Publication validation and regression tests
.github/workflows/    # CI checks on pushes and pull requests
.openai/hosting.json  # Sites project identity and public asset directory
```

## Updating the research

See [the editorial workflow](editorial/README.md). AI can prepare drafts; a human must approve a reviewed release. The validator checks required fields, original-source links, pathway and outlook references, and human-review metadata. It rejects an attempt to switch an unreviewed edition into reviewed mode.

This workflow is intentionally not connected to unattended AI publishing. CI validates each change; automatic GitHub-to-Sites deployment is not configured. Sites releases are made explicitly from the checked, pushed source. A future deployment integration must preserve the editorial approval gate.

## Sources and scope

The included source register links to METR and Anthropic research, including a joint cross-lab evaluation. The sample is small, historical, and not a comprehensive assessment of frontier AI. No inferred probability of catastrophe or fabricated risk trend is presented. Dates identify publication or a specifically cited report update.

## Privacy and security

No accounts, analytics, data uploads, or backend are needed. Only the explanation preference is stored locally. Source text is escaped before rendering. Source URLs must use HTTPS. Fonts load from Google Fonts with system-font fallbacks. Drafts and local files outside `dist/` are not included in the website.

## Portfolio description

Built an interactive web dashboard that translates frontier AI research into a structured, plain-language evidence tracker, separating observed findings from interpretation and speculation while making uncertainty inspectable.
