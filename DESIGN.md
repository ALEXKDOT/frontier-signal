# Frontier Signal — public briefing system

Frontier Signal uses an editorial research language rather than a threat-dashboard aesthetic. The interface should help a non-specialist scan what changed, understand why it matters, and reach the source without obscuring uncertainty.

`dist/assets/style.css` is the visual authority. The application remains native HTML, CSS, and JavaScript with self-hosted Source Serif and Public Sans.

## Identity

Light mode uses warm cream paper, near-white reading surfaces, dark green ink, evergreen actions, and restrained rust accents. Dark mode uses charcoal-green surfaces, pale ink, sage actions, and lighter counterparts for semantic colors. Fine rules, square-to-small radii, and measured whitespace provide structure.

Source Serif carries editorial headlines and important findings. Public Sans carries body copy, metadata, controls, tables, and chart labels. Paragraphs stay at 16–18px, metadata at 13px or larger, and standalone interactive targets at 44px or larger.

The page uses a shared 1280px desktop wrap, 80px outer margins at 1440px, 48px tablet margins, and 24px phone margins. Content aligns to common edges throughout.

## Information hierarchy

The fixed header contains the Frontier Signal mark, the five primary destinations, and Light/Dark controls. Tablets and phones use one accessible full-screen menu. Plain language is the default, so there is no vocabulary switch.

The Briefing view is organized as:

1. a factual hero and compact edition summary;
2. What changed this week;
3. records added by type over time;
4. latest control cases;
5. current model families;
6. a short methods and glossary invitation;
7. a compact source-oriented footer.

The homepage never renders the exhaustive model catalog. Updates retains the complete searchable timeline; Control cases gives evidence-heavy incidents their own focused view; Model map provides family-level context; Methods & sources preserves the research apparatus.

## Update grammar

Every update type has a stable symbol and restrained accent, always paired with a written label:

- incident — rust;
- evaluation and research — muted steel;
- safeguard and monitoring — forest;
- model release and access — ochre;
- policy and governance — graphite.

Color never carries meaning alone. Evidence labels use neutral, explicit descriptions such as “Primary report,” “Independent research,” “External investigation,” and “Imported — unverified.” There are no certainty meters, star ratings, percentages, or composite risk scores.

Dates use tabular figures. Report dates are visually primary; occurrence dates remain explicit in record detail. Source stacks distinguish source type through text and ordering rather than decorative scoring.

## Homepage presentations

The weekly module uses one dominant development followed by compact, ruled briefs. It is not a wall of identical cards. Each brief includes the type, date, headline, plain summary, why-it-matters line, evidence label, and evidence action.

The twelve-week graphic is a real count visual. Stacked bars show records added by update type, and a semantic table carries the same values for assistive technology. The graphic is labeled “Records added,” never “risk level.”

Control cases use a chronological selector and an evidence reader. Finding, interpretation, and evidence limits remain distinct. A semantic ordered sequence can show supported steps such as evaluation setup, observed behavior, boundary crossed, containment or response, and known outcome. Unsupported steps are labeled unknown instead of being inferred.

Model map is a comparison table on wide screens and an open label/value list on phones. Provider, flagship family, practical family, access status, consequential change, date, and source remain visible. Rows use rules rather than individual card shells.

## Responsive behavior

The hero may fill the first desktop screen when its content supports it, but sections otherwise use natural height. On phones, every section—including the hero and footer—grows from its content. No `100lvh` multipliers, two-screen locks, or clipped overflow are used to force a presentation rhythm.

Desktop split layouts stack text first at tablet and phone widths. The control-case sequence changes from a horizontal ordered flow to a vertical one. The model table becomes labeled rows. The twelve weekly bars remain within the viewport at 320px; the page never uses swipe-only rows.

## Glossary definitions

Relevant jargon is visibly underlined in running text. The first meaningful occurrence becomes a semantic button. Hover and keyboard focus open a temporary definition; click or tap pins it. One shared definition card stays within a 12px viewport inset, flips above or below the trigger when needed, and contains the term, short definition, and Full glossary link.

Escape closes the definition before any underlying record dialog. Outside click closes it. A pinned card returns focus to its trigger when dismissed. Definition cards opened inside a native record dialog remain in the top layer and usable by keyboard.

## Motion and accessibility

Motion is quiet and functional: the hero enters once, buttons respond to hover and press, and links draw or move an arrow by a few pixels. Charts do not animate, update lists do not reveal on scroll, and data does not simulate live activity. Reduced-motion mode removes transitions without hiding content.

The site retains a first-focus skip link, visible focus rings, semantic heading order, persistent form labels, native modal dialogs, trigger-focus restoration, live result counts, screen-reader chart tables, and forced-color support. Update symbols are hidden from assistive technology when the adjacent label already names the type.

## Documentation

The implementation contract and section plan are in [docs/BRIEFING_REDESIGN.md](docs/BRIEFING_REDESIGN.md). QA evidence belongs in `docs/BRIEFING_REDESIGN_QA.md` once checks have actually been run.
