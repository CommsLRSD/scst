# School &amp; Classroom Support Team (SCST) — Interactive Knowledge Experience

A modern, low-scroll single-page web app that turns the Louis Riel School
Division “School and Classroom Support Team” document into an interactive
guide. Built with plain **HTML, CSS, and vanilla JavaScript** — no frameworks,
no build step.

Open `index.html` in any modern browser (or serve the folder with a static
server such as `python3 -m http.server`).

---

## UX approach

The goal is to help people learn the content **in small pieces** rather than
scrolling one long page. Two ideas drive the design:

1. **Choose how you learn.** The landing screen offers two paths:
   - **Guided mode** — a step-by-step flow through nine focused sections, with
     a progress bar, *Back / Next / Home / Jump to section* controls, and a
     **key takeaway** at the end of each section for retention.
   - **Search mode** — a command-palette-style overlay (press `/` anywhere)
     that instantly indexes sections, tiers, team areas, and every staff
     member. Matches are highlighted and clicking a result jumps straight to
     the right place (and can open the person’s card).

2. **Progressive disclosure.** Only a manageable amount is shown at once. Dense
   material is presented as interactive components instead of text walls:
   - **Tier 1 / 2 / 3** appear as a side-by-side **comparison layout**.
   - **Team Structure** is a set of **filterable, expandable accordions**
     (filter by Leadership, Instructional Support, Student Support Services,
     Indigenous Education, Clinical Services, Specialized Supports), each
     revealing clean **staff cards** that open a detail modal.

The visual style is calm and premium: generous spacing, a serif display face
for headings, subtle motion, strong hierarchy, an optional **dark mode**
(remembered across visits), full keyboard navigation, focus states, and a
`prefers-reduced-motion` fallback. The layout is responsive down to mobile.

---

## Project structure

```
index.html        App shell: screens, dialogs, and an inline SVG icon sprite.
css/styles.css    Design tokens (light/dark), layout, and all components.
js/content.js     ← CONTENT MODEL. The single source of truth (edit this).
js/app.js         Rendering + interaction logic (guided, tiers, team, search).
```

The interface is **generated entirely from `js/content.js`**, so you can
maintain the site without touching the rendering code.

---

## Updating content later

Open **`js/content.js`** — it is heavily commented. Common edits:

- **Section text (Guided mode):** edit the `sections` array. Each section has
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
- `Esc` — close Search, the person modal, or the Jump menu
- `← / →` — previous / next section while in Guided mode
- Skip link, focus-visible outlines, focus trapping in dialogs, and ARIA roles
  throughout.

---

## Content note

Text is drawn from *“School and Classroom Support Team DRAFT.docx”* and lightly
rewritten for screen readability (shorter chunks, bullets, cards) **without
changing meaning**, preserving the professional, equity-focused tone.
