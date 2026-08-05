# School &amp; Classroom Support Team (SCST) — Interactive Knowledge Experience

A modern, low-scroll single-page web app that turns the Louis Riel School
Division “School and Classroom Support Team” document into an interactive
guide. Built with plain **HTML, CSS, and vanilla JavaScript** — no frameworks,
no build step.

Open `index.html` in any modern browser (or serve the folder with a static
server such as `python3 -m http.server`).

---

## UX approach

The app is a **dashboard**, modelled on the `CommsLRSD/school-dashboard`
layout: a persistent left **sidebar menu** lists every content area, and the
main panel renders whatever is selected. All information lives in a single
space and is always one click away — there is no guided/stepped flow.

- **Sidebar menu** — every section (Overview, Why This Matters, How Support
  Works, Levels/Tiers, Data-Informed, Team Structure, School-Based Model,
  Current Direction, Looking Ahead). The active item is highlighted; on
  narrow screens the sidebar collapses behind a menu button.
- **Search** — a command-palette-style overlay (press `/` anywhere) that
  indexes sections, tiers, team areas, and every staff member. Matches are
  highlighted and clicking a result jumps straight to the right place (and can
  open the person's card).
- **Leadership reporting hierarchy** — the Team Structure panel keeps the
  reporting tree (Director → Divisional Principals → their direct reports)
  above the filterable area accordions.
- **Dense material as components** — Tier 1/2/3 render as a side-by-side
  comparison; team areas are filterable, expandable cards with staff cards
  that open a detail modal.

The visual style matches the school-dashboard design system: Poppins/Ubuntu
type, LRSD red + green accents, light neutral surfaces and soft shadows, plus
an optional **dark mode** (remembered across visits), full keyboard
navigation, focus states, and a `prefers-reduced-motion` fallback. The layout
is responsive down to mobile.

---

## Project structure

```
index.html        App shell: sidebar + main panel, dialogs, inline SVG icon sprite.
css/styles.css    Design tokens (light/dark), layout, and all components.
js/content.js     ← CONTENT MODEL. The single source of truth (edit this).
js/app.js         Rendering + interaction logic (nav, panels, tiers, team, search).
```

The interface is **generated entirely from `js/content.js`**, so you can
maintain the site without touching the rendering code.

---

## Updating content later

Open **`js/content.js`** — it is heavily commented. Common edits:

- **Section text:** edit the `sections` array — each entry becomes a sidebar
  menu item and a dashboard panel. Each section has
  an `id`, `label`, `title`, `summary`, an array of `blocks`
  (`lead` / `list` / `note` / `grid`), and a `takeaway`.
- **Team members:** edit `teamStructure.areas[].people` — each person is
  `{ name, title, summary }`.
- **Tiers:** edit the `tiers` array.

Because the app builds everything from this file, adding a person or a section
requires no other changes.

### Placeholder hooks for future additions

Search the codebase for `HOOK:` to find ready-made extension points:

- `meta.pdfUrl` — link a downloadable PDF of the source document.
- `meta.contactUrl` — a general team contact link.
- `person.contactUrl` — a per-person contact link (renders automatically as a
  **Contact** button in the person modal when present).

---

## Accessibility &amp; keyboard shortcuts

- `/` — open Search from anywhere
- `Esc` — close Search, the person modal, or the mobile menu
- Skip link, focus-visible outlines, focus trapping in dialogs, and ARIA roles
  throughout.

---

## Content note

Text is drawn from *“School and Classroom Support Team DRAFT.docx”* and lightly
rewritten for screen readability (shorter chunks, bullets, cards) **without
changing meaning**, preserving the professional, equity-focused tone.
