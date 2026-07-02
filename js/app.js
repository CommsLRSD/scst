/* =============================================================================
 * SCST — App logic
 * -----------------------------------------------------------------------------
 * UX APPROACH (short):
 *   The app opens on a calm landing screen offering two paths — Guided and
 *   Search — so users choose HOW they want to learn. Guided mode uses a stepper
 *   with a progress bar and per-section key takeaways, revealing one small
 *   section at a time (progressive disclosure) to aid retention. Dense material
 *   (team structure, tiers) is rendered as interactive accordions and
 *   comparison cards rather than long text. Search mode is a command-palette
 *   style overlay that indexes sections, tiers, areas, and people, highlights
 *   matches, and jumps straight to the relevant place. Everything is generated
 *   from js/content.js, keeping content easy to maintain.
 *
 * The file is organised into small modules: State, Utils, Render (guided,
 * tiers, team), Search, Person modal, Theme, and Navigation/keyboard wiring.
 * ========================================================================== */

(function () {
  "use strict";

  const C = window.SCST_CONTENT;

  /* --------------------------------------------------------------- Utilities */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (v !== null && v !== undefined && v !== false) {
        node.setAttribute(k, v);
      }
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null) return;
      node.append(c.nodeType ? c : document.createTextNode(c));
    });
    return node;
  };

  const escapeHtml = (s) =>
    String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );

  const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const initials = (name) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  const icon = (name) =>
    `<svg class="ico" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

  /* ------------------------------------------------------------------- State */
  const State = {
    step: 0,
    teamFilter: "All",
    lastFocused: null,
  };
  const sections = C.sections;

  /* -------------------------------------------------------------- Screen mgmt */
  const screens = { landing: $("#landing"), guided: $("#guided") };
  function showScreen(name) {
    Object.entries(screens).forEach(([k, node]) =>
      node.classList.toggle("is-active", k === name)
    );
    $("#main").focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ Landing */
  function renderLanding() {
    $("#landingEyebrow").textContent = C.meta.division;
    $("#landingTitle").textContent = C.meta.title;
    $("#landingTagline").textContent = C.meta.tagline;
    $("#landingIntro").textContent = C.meta.intro;

    const map = $("#landingMap");
    map.innerHTML = "";
    sections.forEach((s, i) => {
      const li = el("li", {}, [
        el("button", {
          html: `${icon(s.icon)}<span>${escapeHtml(s.label)}</span>`,
          onclick: () => goToStep(i),
        }),
      ]);
      map.append(li);
    });
  }

  /* ------------------------------------------------------------ Block rendering */
  function renderBlock(block) {
    switch (block.type) {
      case "lead":
        return el("div", { class: "block block-lead", text: block.text });

      case "note":
        return el("div", { class: "block block-note" }, [
          block.heading
            ? el("p", { class: "block-heading", text: block.heading })
            : null,
          el("div", { text: block.text }),
        ]);

      case "list": {
        const wrap = el("div", { class: "block" });
        if (block.heading)
          wrap.append(el("p", { class: "block-heading", text: block.heading }));
        const ul = el("ul", { class: "chk-list" });
        block.items.forEach((it) => ul.append(el("li", { text: it })));
        wrap.append(ul);
        return wrap;
      }

      case "grid": {
        const wrap = el("div", { class: "block" });
        if (block.heading)
          wrap.append(el("p", { class: "block-heading", text: block.heading }));
        const grid = el("div", { class: "mini-grid" });
        block.items.forEach((card) => {
          const ul = el("ul");
          card.points.forEach((p) => ul.append(el("li", { text: p })));
          grid.append(
            el("div", { class: "mini-card" }, [
              el("h4", { text: card.title }),
              ul,
            ])
          );
        });
        wrap.append(grid);
        return wrap;
      }

      case "tiers":
        return renderTiers();

      case "team":
        return renderTeam();

      default:
        return el("div");
    }
  }

  /* -------------------------------------------------------------- Tier cards */
  function renderTiers() {
    const grid = el("div", { class: "tier-grid" });
    C.tiers.forEach((t) => {
      const items = el("ul", { class: "tier-items" });
      t.items.forEach((i) => items.append(el("li", { text: i })));
      grid.append(
        el("article", { class: "tier-card", "data-tier": t.id, id: `card-${t.id}` }, [
          el("div", { class: "tier-top" }, [
            el("span", { class: "tier-level", text: t.level }),
            el("span", { class: "tier-reach", text: t.reach }),
          ]),
          el("h4", { class: "tier-name", text: t.name }),
          el("p", { class: "tier-summary", text: t.summary }),
          items,
          el("div", {
            class: "tier-goal",
            html: `<strong>Goal:</strong> ${escapeHtml(t.goal)}`,
          }),
        ])
      );
    });
    return grid;
  }

  /* ----------------------------------------------------------- Team component */
  function renderTeam() {
    const wrap = el("div", { class: "team-wrap" });

    // Filter chips (plain-language labels).
    const filters = ["All", ...C.teamStructure.areas.map((a) => a.filter)];
    const bar = el("div", { class: "filter-bar", role: "group", "aria-label": "Filter team by area" });
    filters.forEach((f) => {
      bar.append(
        el("button", {
          class: "filter-chip",
          type: "button",
          "aria-pressed": String(f === State.teamFilter),
          text: f,
          onclick: () => {
            State.teamFilter = f;
            $$(".filter-chip", bar).forEach((c) =>
              c.setAttribute("aria-pressed", String(c.textContent === f))
            );
            applyTeamFilter(list, f);
          },
        })
      );
    });
    wrap.append(bar);

    const list = el("div", { class: "area-list" });
    C.teamStructure.areas.forEach((area, idx) => {
      list.append(renderArea(area, idx === 0));
    });
    wrap.append(list);
    applyTeamFilter(list, State.teamFilter);
    return wrap;
  }

  function applyTeamFilter(list, filter) {
    $$(".area", list).forEach((node) => {
      const show = filter === "All" || node.dataset.filter === filter;
      node.style.display = show ? "" : "none";
    });
  }

  function renderArea(area, expanded) {
    const panelId = `panel-${area.id}`;
    const header = el("button", {
      class: "area-header",
      type: "button",
      "aria-expanded": String(expanded),
      "aria-controls": panelId,
      html:
        `<span class="area-ico">${icon(area.icon)}</span>` +
        `<span class="area-meta">` +
        `<span class="area-title">${escapeHtml(area.title)}</span>` +
        `<span class="area-purpose">${escapeHtml(area.purpose)}</span>` +
        `</span>` +
        `<span class="area-count">${area.people.length} people</span>` +
        `<span class="area-caret">${icon("next")}</span>`,
    });

    // Key work chips
    const keywork = el("div", { class: "keywork" });
    area.keyWork.forEach((k) => keywork.append(el("span", { text: k })));

    // People cards
    const people = el("div", { class: "people-grid" });
    area.people.forEach((p) => people.append(personCard(p, area)));

    const bodyChildren = [
      el("p", { class: "area-purpose-full", text: area.purpose }),
      keywork,
    ];
    if (area.note) bodyChildren.push(el("div", { class: "area-note", text: area.note }));
    bodyChildren.push(people);

    const panel = el("div", { class: "area-panel" }, [
      el("div", { class: "area-panel-inner" }, [
        el("div", { class: "area-body", id: panelId }, bodyChildren),
      ]),
    ]);

    const node = el("div", {
      class: "area",
      "data-filter": area.filter,
      "data-area": area.id,
      "aria-expanded": String(expanded),
    }, [header, panel]);

    header.addEventListener("click", () => {
      const open = node.getAttribute("aria-expanded") === "true";
      node.setAttribute("aria-expanded", String(!open));
      header.setAttribute("aria-expanded", String(!open));
    });

    return node;
  }

  function personCard(person, area) {
    return el("button", {
      class: "person-card",
      type: "button",
      "data-person": person.name,
      onclick: () => openPerson(person, area),
      html:
        `<span class="avatar" aria-hidden="true">${escapeHtml(initials(person.name))}</span>` +
        `<span class="person-meta">` +
        `<span class="person-name">${escapeHtml(person.name)}</span>` +
        `<span class="person-role">${escapeHtml(person.title)}</span>` +
        `</span>`,
    });
  }

  /* ------------------------------------------------------------- Guided step */
  function renderStep() {
    const s = sections[State.step];
    const total = sections.length;

    // Progress
    $("#progressFill").style.width = ((State.step + 1) / total) * 100 + "%";
    $("#stepNow").textContent = State.step + 1;
    $("#stepTotal").textContent = total;
    $("#stepName").textContent = s.label;

    // Nav state
    $("#backBtn").disabled = State.step === 0;
    const isLast = State.step === total - 1;
    $("#nextLabel").textContent = isLast ? "Finish" : "Next";

    // Build step
    const step = el("div", { class: "step" }, [
      el("span", {
        class: "step-eyebrow",
        html: `${icon(s.icon)}<span>${escapeHtml(s.label)}</span>`,
      }),
      el("h2", { class: "step-title", text: s.title }),
      el("p", { class: "step-summary", text: s.summary }),
    ]);
    s.blocks.forEach((b) => step.append(renderBlock(b)));

    if (s.takeaway) {
      step.append(
        el("div", { class: "takeaway" }, [
          el("span", { class: "tk-badge", text: "Key takeaway" }),
          el("p", { text: s.takeaway }),
        ])
      );
    }

    const host = $("#guidedContent");
    host.innerHTML = "";
    host.append(step);
    host.scrollTop = 0;

    buildJumpMenu();
  }

  function buildJumpMenu() {
    const menu = $("#jumpMenu");
    menu.innerHTML = "";
    sections.forEach((s, i) => {
      const btn = el("button", {
        role: "menuitem",
        class: i === State.step ? "is-current" : "",
        html: `<span class="num">${i + 1}</span><span>${escapeHtml(s.label)}</span>`,
        onclick: () => {
          goToStep(i);
          toggleJump(false);
        },
      });
      menu.append(el("li", {}, [btn]));
    });
  }

  function goToStep(i) {
    State.step = Math.max(0, Math.min(sections.length - 1, i));
    showScreen("guided");
    renderStep();
  }

  function toggleJump(force) {
    const menu = $("#jumpMenu");
    const btn = $("#jumpToggle");
    const open = force !== undefined ? force : menu.hasAttribute("hidden");
    if (open) {
      menu.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
    } else {
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    }
  }

  /* --------------------------------------------------------------- Person modal */
  function openPerson(person, area) {
    State.lastFocused = document.activeElement;
    $("#personArea").textContent = area ? area.title : "";
    $("#personName").textContent = person.name;
    $("#personRole").textContent = person.title;
    $("#personSummary").textContent = person.summary;

    // HOOK: render a contact link when person.contactUrl is provided.
    const actions = $("#personActions");
    actions.innerHTML = "";
    if (person.contactUrl) {
      actions.append(
        el("a", { href: person.contactUrl, text: "Contact" })
      );
    }

    openDialog("#personModal");
  }

  /* -------------------------------------------------------------- Dialog utils */
  function openDialog(sel) {
    const scrim = $("#scrim");
    if (sel !== "#searchOverlay") scrim.removeAttribute("hidden");
    const node = $(sel);
    node.removeAttribute("hidden");
    // Focus first focusable element inside.
    const focusable = node.querySelector(
      'input, button, a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) focusable.focus();
    document.addEventListener("keydown", trapKey);
    node.__trap = true;
  }

  function closeDialog(sel) {
    const node = $(sel);
    node.setAttribute("hidden", "");
    node.__trap = false;
    // Hide scrim only if no other trapped dialog is open.
    if (!$("#personModal").__trap) $("#scrim").setAttribute("hidden", "");
    document.removeEventListener("keydown", trapKey);
    if (State.lastFocused && document.contains(State.lastFocused)) {
      State.lastFocused.focus();
    }
  }

  function trapKey(e) {
    if (e.key !== "Tab") return;
    const open = $("#personModal").__trap
      ? $("#personModal")
      : $("#searchOverlay").__trap
      ? $("#searchOverlay")
      : null;
    if (!open) return;
    const items = $$(
      'input, button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      open
    ).filter((n) => n.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* -------------------------------------------------------------- Search index */
  const searchIndex = buildSearchIndex();
  function buildSearchIndex() {
    const idx = [];

    sections.forEach((s, i) => {
      const keywords = [];
      s.blocks.forEach((b) => {
        if (b.text) keywords.push(b.text);
        if (b.heading) keywords.push(b.heading);
        if (b.items)
          b.items.forEach((it) =>
            keywords.push(typeof it === "string" ? it : it.title + " " + (it.points || []).join(" "))
          );
      });
      idx.push({
        kind: "Section",
        icon: s.icon,
        title: s.title,
        sub: s.summary,
        haystack: (s.label + " " + s.title + " " + s.summary + " " + keywords.join(" ")).toLowerCase(),
        action: () => goToStep(i),
      });
    });

    C.tiers.forEach((t) => {
      const tierStep = sections.findIndex((s) => s.id === "tiers");
      idx.push({
        kind: "Tier",
        icon: "layers",
        title: `${t.level} — ${t.name}`,
        sub: t.summary,
        haystack: (t.level + " " + t.name + " " + t.reach + " " + t.summary + " " + t.items.join(" ") + " " + t.goal).toLowerCase(),
        action: () => {
          goToStep(tierStep);
          requestAnimationFrame(() => {
            const card = $(`#card-${t.id}`);
            if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        },
      });
    });

    const teamStep = sections.findIndex((s) => s.id === "team");
    C.teamStructure.areas.forEach((area) => {
      idx.push({
        kind: "Team area",
        icon: area.icon,
        title: area.title,
        sub: area.purpose,
        haystack: (area.title + " " + area.filter + " " + area.purpose + " " + area.keyWork.join(" ")).toLowerCase(),
        action: () => openArea(area, teamStep),
      });
      area.people.forEach((p) => {
        idx.push({
          kind: "Person",
          icon: "users",
          title: p.name,
          sub: p.title + " · " + area.title,
          haystack: (p.name + " " + p.title + " " + p.summary + " " + area.title + " " + area.filter).toLowerCase(),
          action: () => {
            openArea(area, teamStep);
            requestAnimationFrame(() => openPerson(p, area));
          },
          person: p,
          area,
        });
      });
    });

    return idx;
  }

  function openArea(area, teamStep) {
    goToStep(teamStep);
    requestAnimationFrame(() => {
      State.teamFilter = "All";
      const node = $(`.area[data-area="${area.id}"]`);
      if (node) {
        node.setAttribute("aria-expanded", "true");
        node.querySelector(".area-header").setAttribute("aria-expanded", "true");
        node.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    const re = new RegExp("(" + escapeReg(q) + ")", "ig");
    return escapeHtml(text).replace(
      new RegExp("(" + escapeReg(escapeHtml(q)) + ")", "ig"),
      "<mark>$1</mark>"
    );
  }

  function runSearch(q) {
    const results = $("#searchResults");
    const hint = $("#searchHint");
    results.innerHTML = "";
    const query = q.trim().toLowerCase();

    if (!query) {
      hint.style.display = "";
      return;
    }
    hint.style.display = "none";

    const matches = searchIndex
      .map((item) => ({ item, i: item.haystack.indexOf(query) }))
      .filter((m) => m.i !== -1)
      .sort((a, b) => a.i - b.i);

    if (!matches.length) {
      results.append(
        el("p", { class: "search-empty", text: `No matches for “${q}”. Try a name, role, or keyword.` })
      );
      return;
    }

    // Group by kind, preserving a friendly order.
    const order = ["Section", "Tier", "Team area", "Person"];
    const groups = {};
    matches.forEach((m) => (groups[m.item.kind] = groups[m.item.kind] || []).push(m.item));

    order.forEach((kind) => {
      if (!groups[kind]) return;
      results.append(el("div", { class: "result-group-label", text: kind + "s" }));
      groups[kind].forEach((item) => {
        const btn = el("button", {
          class: "result",
          role: "option",
          html:
            `<span class="result-ico">${icon(item.icon)}</span>` +
            `<span class="result-main">` +
            `<span class="result-title">${highlight(item.title, q)}</span>` +
            `<span class="result-sub">${highlight(item.sub, q)}</span>` +
            `</span>` +
            `<span class="result-kind">${escapeHtml(kind)}</span>`,
          onclick: () => {
            closeDialog("#searchOverlay");
            item.action();
          },
        });
        results.append(btn);
      });
    });
  }

  function openSearch() {
    State.lastFocused = document.activeElement;
    openDialog("#searchOverlay");
    const input = $("#searchInput");
    input.value = "";
    runSearch("");
    input.focus();
  }

  /* ---------------------------------------------------------------- Theme */
  const THEME_KEY = "scst-theme";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    const btn = $("#themeToggle");
    btn.setAttribute("aria-pressed", String(isDark));
    btn.querySelector("use").setAttribute("href", isDark ? "#i-moon" : "#i-sun");
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }
  function initTheme() {
    let theme;
    try { theme = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(theme);
  }

  /* -------------------------------------------------------------- Wiring */
  function wire() {
    $("#startGuided").addEventListener("click", () => goToStep(0));
    $("#startSearch").addEventListener("click", openSearch);
    $("#brandHome").addEventListener("click", () => showScreen("landing"));
    $("#homeBtn").addEventListener("click", () => showScreen("landing"));

    $("#backBtn").addEventListener("click", () => goToStep(State.step - 1));
    $("#nextBtn").addEventListener("click", () => {
      if (State.step === sections.length - 1) showScreen("landing");
      else goToStep(State.step + 1);
    });

    $("#jumpToggle").addEventListener("click", () => toggleJump());
    document.addEventListener("click", (e) => {
      if (!e.target.closest("#jumpMenu") && !e.target.closest("#jumpToggle")) {
        toggleJump(false);
      }
    });

    $("#openSearchBtn").addEventListener("click", openSearch);
    $("#searchClose").addEventListener("click", () => closeDialog("#searchOverlay"));
    $("#searchInput").addEventListener("input", (e) => runSearch(e.target.value));
    $("#searchOverlay").addEventListener("mousedown", (e) => {
      if (e.target.id === "searchOverlay") closeDialog("#searchOverlay");
    });

    $("#personClose").addEventListener("click", () => closeDialog("#personModal"));
    $("#scrim").addEventListener("click", () => {
      if ($("#personModal").__trap) closeDialog("#personModal");
    });

    $("#themeToggle").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });

    // Global keyboard shortcuts.
    document.addEventListener("keydown", (e) => {
      // "/" opens search (unless typing in a field).
      if (e.key === "/" && !/input|textarea|select/i.test(e.target.tagName)) {
        e.preventDefault();
        openSearch();
        return;
      }
      if (e.key === "Escape") {
        if ($("#searchOverlay").__trap) return closeDialog("#searchOverlay");
        if ($("#personModal").__trap) return closeDialog("#personModal");
        if (!$("#jumpMenu").hasAttribute("hidden")) return toggleJump(false);
      }
      // Arrow navigation while in guided mode (not in a dialog/field).
      const inGuided = screens.guided.classList.contains("is-active");
      const inField = /input|textarea|select/i.test(e.target.tagName);
      const dialogOpen = $("#searchOverlay").__trap || $("#personModal").__trap;
      if (inGuided && !inField && !dialogOpen) {
        if (e.key === "ArrowRight") goToStep(State.step + 1);
        if (e.key === "ArrowLeft") goToStep(State.step - 1);
      }
    });
  }

  /* ---------------------------------------------------------------- Init */
  initTheme();
  renderLanding();
  wire();
})();
