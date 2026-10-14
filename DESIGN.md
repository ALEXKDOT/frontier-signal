---
name: Frontier Signal
description: A compact instrument panel for the AI landscape and its evidence.
colors:
  canvas: '#171719'
  header: '#101012'
  panel: '#232326'
  selected-surface: '#36363C'
  text: '#F6F6F8'
  secondary-text: '#C0C0CA'
  divider: '#55555E'
  control-border: '#80808A'
  accent: '#FF795E'
  accent-hover: '#FF947E'
  action-text: '#161619'
  focus: '#FFB5A4'
  destructive: '#FFAFBE'
  concern: '#EFC59A'
  safeguard: '#B8DCBA'
  evidence: '#DCE7B0'
typography:
  family: 'Menlo, Consolas, monospace'
  body: '14px / 1.5'
  page-heading: '700 36px / 1.25'
  mobile-page-heading: '700 28px / 1.25'
  panel-heading: '700 19–23px / 1.25'
  metadata: '12–14px / 1.5'
layout:
  maximum-width: 1600px
  desktop-gutter: 24px
  mobile-gutter: 14px
  panel-gap: 16px
  panel-padding: 18px
  mobile-panel-padding: 16px 12px
  radius: 0
  minimum-control-height: 44px
---

# Frontier Signal — Signal visual direction

The current visual system uses dense charcoal panels, monospace typography, square controls, and restrained coral accents. It translates the user-supplied Signal desktop/mobile screenshots and reference CSS into Frontier Signal's existing workflows. The application retains its branding, labels, content, source links, data, and five navigation destinations.

`dist/assets/style.css` is the implementation authority. This document supersedes the October 5 Reference Handbook direction. `.impeccable/design.json` remains a historical October 5 snapshot, not the current token source.

## Structure and typography

The application has a compact masthead and horizontal navigation. An active destination has a charcoal fill, bold text, and a 3px coral bottom rule. Mobile navigation wraps into three columns; every destination remains visible. The vocabulary switch retains its accessible name, state, and persistent preference, with a square track and thumb.

All interface text uses the system monospace stack. There are no runtime font requests or font preloads. The previous font assets and their licenses remain in the repository. Headings use weight and alignment instead of serif typography; metadata remains legible at 12px or larger.

The content workspace is at most 1600px wide, with 24px gutters, 16px gaps, and 16–18px panel padding. At 560px and below, outer gutters are 14px. Main columns collapse at 850px. Text-heavy methodology panels retain a readable line length within the broader workspace.

## Panels and controls

Panels, dialogs, inputs, buttons, badges, and filters are rectangular with zero radius. They use thin dividers and no decorative shadows or gradients. Controls use the stronger control-border token; reading surfaces use the divider token.

Provider choices form an equally sized key bank. Selection uses coral fill, dark text, an underline, and the existing `aria-pressed` state. The paired featured models remain comparable. Full catalogs retain provider-specific expansion, search, category filters, counts, reset, and collapse behavior.

Incident selection and its evidence readout use approximately 43% / 57% columns. The selected incident has a raised charcoal fill and a coral side rule. Primary evidence-reading actions use coral fill and dark text; secondary disclosures retain charcoal surfaces with clear borders. Observation, interpretation, and evidence limits remain separate fields.

Timeline categories use square controls with written selection state and coral emphasis. Timeline rows use bordered charcoal panels and preserve report dates, occurrence dates, source classifications, pagination, and pathway links. On phones, the date becomes a horizontal metadata row above the record.

The concern ladder uses the same 43% / 57% split on desktop and one column at tablet widths. Selecting a level on a stacked layout focuses and reveals the evidence panel; the return control restores focus to the selected level. Methodology sections, source disclosures, provenance, update history, and glossary share the same panel system.

Dialogs use a charcoal surface, a thin border, a coral top rule, and a flat dark backdrop. A sticky square close control remains available while reading. Native modal keyboard behavior, Escape dismissal, focus restoration, and glossary return behavior remain intact.

## Semantic color and evidence symbols

UI coral is separate from evidence meaning. The existing dark-surface amber and green colors identify concern and safeguard signals, with their written labels and arrow symbols. Availability badges retain the exact existing foreground/background pairs:

| Status | Foreground | Background |
| --- | --- | --- |
| Available / downloadable / product access | `#30523C` | `#E7EEE4` |
| Preview / retiring / existing users | `#82420F` | `#F4E8D8` |
| Restricted access | `#A12132` | `#F8E0E0` |

Restricted access remains explicitly labeled and red. The concern ladder preserves full, half-filled, and outlined circles for documented, limited, and unestablished evidence. Their pale green evidence color is independent of selection. The half fill is a semantic data symbol; its gradient is not decoration. No maps or plotting surfaces exist in this application, and none were added.

Model source checks, incident reviews, and incident coverage remain separate dates. A design change must not imply continuous ingestion, independent replication, human review, a model ranking, or a new risk score.

## Accessibility and alternate rendering

- Keyboard focus uses a 3px `#FFB5A4` outline with a 3px offset, including navigation and primary actions.
- Standalone controls have at least 44px target height. Inline definitions and prose links retain text flow.
- Persistent labels, semantic headings, skip navigation, native controls, live counts, `aria-current`, `aria-pressed`, and modal accessible names remain in place.
- Selected controls also use underlines, rules, weight, or explicit state; semantic information is never color-only.
- Reduced motion disables switch transitions and smooth scrolling. Forced colors preserves selection outlines and evidence symbols.
- Print uses a neutral light surface and readable dark text.

See `docs/SIGNAL_RESTYLE_QA.md` for verification. Publication follows explicit user approval through the existing GitHub Pages workflow.
