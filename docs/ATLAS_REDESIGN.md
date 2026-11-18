# Research atlas UI redesign

The requested redesign uses the supplied Polar Vortex and Chokepoint Watch screenshots as visual references. The intended result is a readable research application with editorial typography, restrained instrument-style controls, clear evidence hierarchy, and usable desktop and phone layouts.

## Requirements

- Keep all five existing views, model catalogs, record details, filters, pagination, glossary, and provenance functional.
- Preserve the research datasets, evidence limitations, source links, release metadata, and distinction between automated summaries and human review.
- Use the available Taste design skill and Matt Pocock implementation/review guidance, adapted to the functioning research app and the user's compact dashboard references.
- Give the dashboard a useful first-screen orientation and direct paths into the model directory and the qualitative outlook.
- Summarize the existing record collection by signal direction using counts derived from the dataset. Clearly distinguish record counts from incident frequency or risk estimates.
- Add a persistent light/dark reading preference with accessible controls; retain the separate simplified-vocabulary preference, off by default.
- Improve the model directory's provider selection and progressive disclosure without suggesting cross-provider benchmark rankings.
- Maintain readable type, keyboard access, visible focus, native dialog dismissal and focus return, reduced motion, and small-screen layouts.
- Keep the static HTML/CSS/JavaScript architecture, self-hosted fonts, and existing build workflow. No runtime dependency or backend is needed.
- Make the local change reviewable. Do not publish the site or environment.

## Scope of the references

The weather chart and maritime screens are design references only. Their data, geographic visuals, labels, live status, and alert counts are not content for Frontier Signal. No decorative map, invented forecast, or simulated live telemetry is added.
