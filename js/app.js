/* =============================================================================
 * SCST — App logic
 * -----------------------------------------------------------------------------
 * UX APPROACH (short):
 *   A dashboard shell. A persistent sidebar menu lists every content area, and
 *   the main panel renders whatever the user selects, so all information is
 *   always one click away from a single space (no guided/stepped flow). Dense
 *   material (leadership hierarchy, tiers, team areas) is rendered as cards,
 *   a reporting tree, and expandable area panels. A command-palette style
 *   search overlay indexes sections, tiers, areas, and people and jumps
 *   straight to the relevant place. Everything is generated from
 *   js/content.js, keeping content easy to maintain.
 *
 * The file is organised into small modules: State, Utils, Render (panels,
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

  /* ------------------------------------------------------- Dashboard chrome */
  function renderChrome() {
    $("#brandDivision").textContent = C.meta.division;
    $("#headerEyebrow").textContent = C.meta.division;
    $("#heroTagline").textContent = C.meta.tagline;
    $("#heroIntro").textContent = C.meta.intro;
  }

  /* ------------------------------------------------------------ Sidebar menu */
  function renderNav() {
    const list = $("#navList");
    list.innerHTML = "";
    sections.forEach((s, i) => {
      const btn = el("button", {
        class: "nav-link",
        type: "button",
        "data-section": s.id,
        "aria-current": i === State.step ? "page" : null,
        html: `<span class="nav-ico">${icon(s.icon)}</span><span>${escapeHtml(s.label)}</span>`,
        onclick: () => {
          goToSection(i);
          closeSidebar();
        },
      });
      list.append(el("li", {}, [btn]));
    });
  }

  function syncNav() {
    $$("#navList .nav-link").forEach((btn) => {
      const active = btn.dataset.section === sections[State.step].id;
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }

  function toggleSidebar(force) {
    const sidebar = $("#sidebar");
    const overlay = $("#sidebarOverlay");
    const open = force !== undefined ? force : !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", open);
    overlay.toggleAttribute("hidden", !open);
    $("#sidebarToggle").setAttribute("aria-expanded", String(open));
  }

  function closeSidebar() {
    toggleSidebar(false);
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
            el("div", { class: "data-card mini-card" }, [
              el("div", { class: "card-header" }, [
                el("h4", { class: "card-title", text: card.title }),
              ]),
              el("div", { class: "card-body" }, [ul]),
            ])
          );
        });
        wrap.append(grid);
        return wrap;
      }

      case "tiers":
        return renderTiers(block.intro);

      case "team":
        return renderTeam();

      default:
        return el("div");
    }
  }

  /* -------------------------------------------------------------- Tier cards */
  function renderTiers(intro) {
    const grid = el("div", { class: "tier-grid" });
    if (intro) {
      grid.append(el("div", { class: "tier-intro", text: intro }));
    }
    C.tiers.forEach((t) => {
      const items = el("ul", { class: "tier-items" });
      t.items.forEach((i) => items.append(el("li", { text: i })));
      grid.append(
        el("article", { class: "data-card tier-card", "data-tier": t.id, id: `card-${t.id}` }, [
          el("div", { class: "card-header" }, [
            el("span", { class: "tier-level", text: t.level }),
            el("span", { class: "tier-reach", text: t.reach }),
          ]),
          el("div", { class: "card-body" }, [
            el("h4", { class: "card-title tier-name", text: t.name }),
            el("p", { class: "tier-summary", text: t.summary }),
            items,
            el("div", {
              class: "tier-goal",
              html: `<strong>Goal:</strong> ${escapeHtml(t.goal)}`,
            }),
          ]),
        ])
      );
    });
    return grid;
  }

  /* ----------------------------------------------------------- Team component */
  function hierarchyTitle(filter) {
    if (filter === "All") return "School and Classroom Supports";
    const area = C.teamStructure.areas.find((a) => a.filter === filter);
    return area ? area.title : filter;
  }

  function renderTeam() {
    const wrap = el("div", { class: "team-wrap" });

    // Filter chips (plain-language labels) — rendered ABOVE the hierarchy.
    const filters = ["All", ...C.teamStructure.areas.map((a) => a.filter)];
    const bar = el("div", { class: "filter-bar", role: "group", "aria-label": "Filter team by area" });

    let hierarchyCard = null;
    let hierarchyTitleEl = null;

    if (Array.isArray(C.teamStructure.hierarchy) && C.teamStructure.hierarchy.length) {
      const result = renderHierarchy(C.teamStructure.hierarchy, State.teamFilter);
      hierarchyCard = result.card;
      hierarchyTitleEl = result.titleEl;
    }

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
            if (hierarchyTitleEl) hierarchyTitleEl.textContent = hierarchyTitle(f);
            applyTeamFilter(list, f);
            if (hierarchyCard) applyHierarchyFilter(hierarchyCard, f);
          },
        })
      );
    });
    wrap.append(bar);

    if (hierarchyCard) wrap.append(hierarchyCard);

    const list = el("div", { class: "area-list" });
    C.teamStructure.areas.forEach((area, idx) => {
      list.append(renderArea(area, idx === 0));
    });
    wrap.append(list);
    applyTeamFilter(list, State.teamFilter);
    if (hierarchyCard) applyHierarchyFilter(hierarchyCard, State.teamFilter);
    return wrap;
  }

  function applyTeamFilter(list, filter) {
    $$(".area", list).forEach((node) => {
      const show = filter === "All" || node.dataset.filter === filter;
      node.style.display = show ? "" : "none";
    });
  }

  /**
   * Show only hierarchy nodes whose areaIds include the active filter area,
   * plus any ancestor nodes needed to maintain the chain up to the root.
   * When filter is "All", all nodes are visible.
   * Hides the entire card when no nodes match.
   */
  function applyHierarchyFilter(card, filter) {
    if (filter === "All") {
      $$(".hierarchy-node", card).forEach((n) => { n.style.display = ""; });
      const specSection = card.querySelector(".hierarchy-specialized");
      if (specSection) specSection.style.display = "";
      card.style.display = "";
      return;
    }
    // Find the matching area id for the active filter label.
    const area = C.teamStructure.areas.find((a) => a.filter === filter);
    const activeId = area ? area.id : null;

    // Walk each node: show it if its areaIds includes the active area OR if
    // it has any visible descendant (so the chain from root is preserved).
    function walkVisible(nodes) {
      // Process every sibling node so each one gets its display set correctly.
      // Returns true if at least one node in the list (or its subtree) matches.
      let anyVisible = false;
      nodes.forEach((node) => {
        const nodeEl = card.querySelector(`[data-node-id="${node.id}"]`);
        const selfMatches = Array.isArray(node.areaIds) && node.areaIds.includes(activeId);
        const childMatches = Array.isArray(node.reports) && node.reports.length
          ? walkVisible(node.reports)
          : false;
        const visible = selfMatches || childMatches;
        if (nodeEl) nodeEl.style.display = visible ? "" : "none";
        if (visible) anyVisible = true;
      });
      return anyVisible;
    }
    const anyVisible = walkVisible(C.teamStructure.hierarchy);

    // Handle the specialized supports section separately.
    const specSection = card.querySelector(".hierarchy-specialized");
    if (specSection && Array.isArray(C.teamStructure.specializedSupports)) {
      const specVisible = walkVisible(C.teamStructure.specializedSupports);
      specSection.style.display = specVisible ? "" : "none";
    }

    card.style.display = (anyVisible || (specSection && specSection.style.display !== "none")) ? "" : "none";
  }

  function renderArea(area, expanded) {
    const panelId = `panel-${area.id}`;
    const header = el("button", {
      class: "card-header area-header",
      type: "button",
      "aria-expanded": String(expanded),
      "aria-controls": panelId,
      html:
        `<span class="card-header-icon area-ico">${icon(area.icon)}</span>` +
        `<span class="area-meta">` +
        `<span class="card-title area-title">${escapeHtml(area.title)}</span>` +
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
        el("div", { class: "card-body area-body", id: panelId }, bodyChildren),
      ]),
    ]);

    const node = el("div", {
      class: "data-card area",
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
      class: "data-card person-card",
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

  function renderHierarchy(nodes, filter) {
    const titleEl = el("h3", { class: "card-title", text: hierarchyTitle(filter || "All") });
    const bodyChildren = [
      el("p", {
        class: "hierarchy-summary",
        text: "A classic tree view showing who each broader branch and sub-team reports through.",
      }),
      hierarchyList(nodes),
    ];

    if (Array.isArray(C.teamStructure.specializedSupports) && C.teamStructure.specializedSupports.length) {
      const specSection = el("div", { class: "hierarchy-specialized" }, [
        el("p", { class: "hierarchy-specialized-label", text: "Specialized Supports" }),
        hierarchyList(C.teamStructure.specializedSupports),
      ]);
      bodyChildren.push(specSection);
    }

    const card = el("section", { class: "data-card hierarchy-card", "aria-label": "Reporting structure" }, [
      el("div", { class: "card-header" }, [
        el("span", { class: "card-header-icon", html: icon("users"), "aria-hidden": "true" }),
        titleEl,
      ]),
      el("div", { class: "card-body" }, bodyChildren),
    ]);
    return { card, titleEl };
  }

  function hierarchyList(nodes, depth = 0) {
    const list = el("ol", { class: depth === 0 ? "hierarchy-tree" : "hierarchy-branch" });
    nodes.forEach((node) => list.append(hierarchyNode(node, depth)));
    return list;
  }

  function hierarchyNode(node, depth) {
    const item = el("li", { class: "hierarchy-node", "data-node-id": node.id || "" });
    const meta = el("div", { class: "hierarchy-person", "data-depth": String(depth) }, [
      el("span", { class: "hierarchy-avatar", text: initials(node.name), "aria-hidden": "true" }),
      el("div", { class: "hierarchy-meta" }, [
        el("p", { class: "hierarchy-level", text: `Level ${depth + 1}` }),
        el("p", { class: "hierarchy-name", text: node.name }),
        el("p", { class: "hierarchy-role", text: node.title }),
      ]),
    ]);
    item.append(meta);

    if (Array.isArray(node.areaIds) && node.areaIds.length) {
      const chips = el("div", { class: "hierarchy-areas", "aria-label": "Areas" });
      node.areaIds
        .map((id) => C.teamStructure.areas.find((area) => area.id === id))
        .filter(Boolean)
        .forEach((area) => chips.append(el("span", { class: "hierarchy-area-chip", text: area.title })));
      item.append(chips);
    }

    if (node.reports && node.reports.length) {
      item.append(hierarchyList(node.reports, depth + 1));
    }

    return item;
  }

  /* ------------------------------------------------------------ Panel render */
  function renderPanel() {
    const s = sections[State.step];

    $("#headerTitle").textContent = s.title;
    document.title = `${s.label} — ${C.meta.title}`;

    const panel = el("section", { class: "panel", "aria-label": s.title }, [
      el("span", {
        class: "panel-eyebrow",
        html: `${icon(s.icon)}<span>${escapeHtml(s.label)}</span>`,
      }),
      el("h2", { class: "panel-title", text: s.title }),
      el("p", { class: "panel-summary", text: s.summary }),
    ]);
    s.blocks.forEach((b) => panel.append(renderBlock(b)));

    if (s.takeaway) {
      panel.append(
        el("div", { class: "takeaway" }, [
          el("span", { class: "tk-badge", text: "Key takeaway" }),
          el("p", { text: s.takeaway }),
        ])
      );
    }

    const host = $("#panelHost");
    host.innerHTML = "";
    host.append(panel);

    syncNav();
  }

  function goToSection(i) {
    State.step = Math.max(0, Math.min(sections.length - 1, i));
    renderPanel();
    $("#main").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "auto" });
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
        action: () => goToSection(i),
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
          goToSection(tierStep);
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
    goToSection(teamStep);
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
    $("#brandHome").addEventListener("click", () => {
      goToSection(0);
      closeSidebar();
    });

    $("#sidebarToggle").addEventListener("click", () => toggleSidebar());
    $("#sidebarOverlay").addEventListener("click", closeSidebar);

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
        if ($("#sidebar").classList.contains("is-open")) return closeSidebar();
      }
    });
  }

  /* ---------------------------------------------------------------- Init */
  initTheme();
  renderChrome();
  renderNav();
  renderPanel();
  wire();
})();
