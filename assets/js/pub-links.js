/**
 * pub-links.js
 * ─────────────────────────────────────────────────────────
 * Handles the publications page interactivity:
 *   • Highlights "Arne Meier" in author lists
 *   • Live search across all publications
 *   • Section filter buttons (with per-section item counts)
 *   • Keyword tag cloud with AND-logic filtering
 *   • Cross-publication navigation (journal ↔ conference version badges)
 *   • Counters & UI feedback
 *
 * HTML structure (jekyll-scholar + bib.html):
 *   <ol class="bibliography">
 *     <li>                          ← jekyll-scholar wrapper (layout row)
 *       <div class="pub-item" …>    ← bib.html  (data attributes live here)
 *         …
 *       </div>
 *     </li>
 *   </ol>
 *
 * Show/hide and highlight are applied to the <li> row,
 * while data lookups (key, keywords, …) use .pub-item.
 */

document.addEventListener("DOMContentLoaded", function () {

  /* ── 1. Clean BibTeX braces & highlight own name ───────── */
  document.querySelectorAll(".pub-title-row, .pub-authors, .pub-venue").forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/[{}]/g, "");
  });

  document.querySelectorAll(".pub-authors").forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(
      /Arne Meier/g,
      '<strong class="pub-self">Arne Meier</strong>'
    );
  });

  /* ── 2. Collect elements ───────────────────────────────── */
  /*
   * allItems  – every .pub-item div (carries data-* attributes)
   * getRow(item) – returns the <li> layout row for an item
   */
  const allItems    = Array.from(document.querySelectorAll(".pub-item"));
  const allSects    = Array.from(document.querySelectorAll(".pub-section"));
  const searchInput = document.getElementById("pub-search");
  const clearBtn    = document.getElementById("pub-search-clear");
  const resultsInfo = document.getElementById("pub-results-info");
  const countNum    = document.getElementById("pub-count-num");
  const queryText   = document.getElementById("pub-query-text");
  const filterBtns  = Array.from(document.querySelectorAll(".filter-btn"));
  const countAllEl  = document.getElementById("count-all");
  const tagCloud    = document.getElementById("pub-tag-cloud");

  function getRow(item) {
    /* The immediate <li> parent inside the ol.bibliography */
    return item.closest("ol.bibliography > li") || item;
  }

  /* ── 3. Populate counts on filter buttons ──────────────── */
  if (countAllEl) countAllEl.textContent = allItems.length;

  filterBtns.forEach(function (btn) {
    const sectId = btn.dataset.section;
    if (!sectId || sectId === "all") return;
    const sect = document.getElementById(sectId);
    if (!sect) return;
    const n = sect.querySelectorAll(".pub-item").length;
    let countSpan = btn.querySelector(".filter-count");
    if (!countSpan) {
      countSpan = document.createElement("span");
      countSpan.className = "filter-count";
      btn.appendChild(countSpan);
    }
    countSpan.textContent = n;
  });

  /* ── 4. Filter state ───────────────────────────────────── */
  let activeSection = "all";
  let searchQuery   = "";
  const activeKws   = new Set();

  /* ── 5. Build keyword tag cloud ────────────────────────── */
  const kwButtonMap = {};
  const kwBadgeMap  = {};   /* keyword → count <span> inside button   */
  let   kwCounts    = {};   /* keyword → total pubs (set during build) */

  if (tagCloud) {
    const allKeywords = new Set();

    allItems.forEach(function (item) {
      const raw = item.dataset.keywords || "";
      raw.split(",").map(function (k) { return k.trim(); })
         .filter(Boolean)
         .forEach(function (k) {
           allKeywords.add(k);
           kwCounts[k] = (kwCounts[k] || 0) + 1;
         });
    });

    Array.from(allKeywords).sort().forEach(function (kw) {
      const btn = document.createElement("button");
      btn.className   = "kw-tag-btn";
      btn.dataset.kw  = kw;
      btn.setAttribute("aria-pressed", "false");

      /* Label: "#keyword" + count badge */
      btn.appendChild(document.createTextNode("#" + kw + "\u00a0"));
      const badge = document.createElement("span");
      badge.className   = "filter-count";
      badge.textContent = kwCounts[kw];
      btn.appendChild(badge);

      btn.addEventListener("click", function () { toggleKeyword(kw); });
      tagCloud.appendChild(btn);
      kwButtonMap[kw] = btn;
      kwBadgeMap[kw]  = badge;
    });

    if (allKeywords.size === 0) tagCloud.style.display = "none";
  }

  /* ── 6. Keyword availability ────────────────────────────────
   *
   * After every filter change: for each keyword that is NOT
   * currently active, test whether at least one visible item
   * (respecting the active section) carries ALL active keywords
   * PLUS that candidate keyword.  If no such item exists the
   * button is greyed-out and disabled so the user cannot create
   * a combination that returns zero results.
   * ────────────────────────────────────────────────────────── */
  function updateKwAvailability() {
    Object.keys(kwButtonMap).forEach(function (kw) {
      const btn   = kwButtonMap[kw];
      const badge = kwBadgeMap[kw];

      /* ── Build the test set ──────────────────────────────────────
       *  Active kw   → testSet = activeKws            (kw already in)
       *  Inactive kw → testSet = activeKws ∪ { kw }  (prospective add)
       * ─────────────────────────────────────────────────────────── */
      const testSet = new Set(activeKws);
      if (!activeKws.has(kw)) testSet.add(kw);

      /* ── Count papers in the active section matching testSet ──── */
      const count = allItems.reduce(function (n, item) {
        const sect = item.closest(".pub-section");
        if (sect && activeSection !== "all" && sect.id !== activeSection) return n;
        const itemKws = new Set(
          (item.dataset.keywords || "").split(",")
            .map(function (k) { return k.trim(); })
            .filter(Boolean)
        );
        return Array.from(testSet).every(function (k) { return itemKws.has(k); })
          ? n + 1 : n;
      }, 0);

      /* Update badge */
      if (badge) badge.textContent = count;

      /* ── Active keyword → always enabled ─────────────────────── */
      if (activeKws.has(kw)) {
        btn.classList.remove("kw-unavailable");
        btn.disabled = false;
        return;
      }

      /* ── Inactive keyword → enable iff count > 0 ─────────────── */
      if (count > 0) {
        btn.classList.remove("kw-unavailable");
        btn.disabled = false;
      } else {
        btn.classList.add("kw-unavailable");
        btn.disabled = true;
      }
    });
  }

  /* ── 7. Keyword toggle ─────────────────────────────────── */
  function toggleKeyword(kw) {
    const btn = kwButtonMap[kw];
    if (activeKws.has(kw)) {
      activeKws.delete(kw);
      if (btn) { btn.classList.remove("active"); btn.setAttribute("aria-pressed", "false"); }
    } else {
      activeKws.add(kw);
      if (btn) { btn.classList.add("active"); btn.setAttribute("aria-pressed", "true"); }
    }
    applyFilters();
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("pub-kw-tag")) {
      const kw = e.target.dataset.kw;
      if (kw) toggleKeyword(kw);
    }
  });

  /* ── 8. Core filter function ───────────────────────────── */
  function applyFilters() {
    const query  = searchQuery.trim().toLowerCase();
    const sectId = activeSection;
    let visible  = 0;

    /* Show / hide section wrappers */
    allSects.forEach(function (sect) {
      sect.style.display = (sectId === "all" || sect.id === sectId) ? "" : "none";
    });

    /* Show / hide individual rows */
    allItems.forEach(function (item) {
      const sect = item.closest(".pub-section");
      if (sect && sect.style.display === "none") return;

      const text         = item.textContent.toLowerCase();
      const matchesSearch = !query || text.includes(query);

      let matchesKw = true;
      if (activeKws.size > 0) {
        const itemKws = new Set(
          (item.dataset.keywords || "").split(",")
            .map(function (k) { return k.trim(); })
            .filter(Boolean)
        );
        matchesKw = Array.from(activeKws).every(function (k) { return itemKws.has(k); });
      }

      const matches = matchesSearch && matchesKw;
      getRow(item).style.display = matches ? "" : "none";
      if (matches) visible++;
    });

    /* Hide sections where every row is hidden */
    if (query || activeKws.size > 0) {
      allSects.forEach(function (sect) {
        if (sect.style.display === "none") return;
        const anyVisible = Array.from(sect.querySelectorAll(".pub-item")).some(function (item) {
          return getRow(item).style.display !== "none";
        });
        if (!anyVisible) sect.style.display = "none";
      });
    }

    /* Results info bar */
    const filtering = query || activeKws.size > 0;
    if (filtering && resultsInfo) {
      resultsInfo.style.display = "";
      if (countNum)  countNum.textContent  = visible;
      if (queryText) queryText.textContent = buildQueryLabel(query);
    } else if (resultsInfo) {
      resultsInfo.style.display = "none";
    }

    if (clearBtn) clearBtn.style.display = query ? "" : "none";

    removeNoResultsMsg();
    if (filtering && visible === 0) insertNoResultsMsg();

    /* Update which keyword buttons are still reachable */
    updateKwAvailability();
  }

  function buildQueryLabel(query) {
    const parts = [];
    if (query)          parts.push('"' + searchQuery.trim() + '"');
    if (activeKws.size) parts.push(Array.from(activeKws).map(function (k) { return "#" + k; }).join(" + "));
    return parts.join("  ·  ");
  }

  /* ── 8. No-results message ─────────────────────────────── */
  function insertNoResultsMsg() {
    if (document.getElementById("pub-no-results-msg")) return;
    const msg = document.createElement("p");
    msg.id          = "pub-no-results-msg";
    msg.className   = "pub-no-results";
    msg.textContent = "No publications match your search.";
    const container = document.querySelector(".pub-section") || document.body;
    container.parentNode.insertBefore(msg, container);
  }

  function removeNoResultsMsg() {
    const el = document.getElementById("pub-no-results-msg");
    if (el) el.remove();
  }

  /* ── 9. Search input ────────────────────────────────────── */
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      searchQuery = this.value;
      applyFilters();
    });
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        this.value = "";
        searchQuery = "";
        applyFilters();
        this.blur();
      }
    });
  }

  /* ── 10. Clear button ───────────────────────────────────── */
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      activeKws.clear();
      Object.values(kwButtonMap).forEach(function (btn) {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  /* ── 11. Section filter buttons ─────────────────────────── */
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      this.classList.add("active");
      activeSection = this.dataset.section || "all";
      applyFilters();
    });
  });

  /* ── 12. Initial run ─────────────────────────────────────── */
  applyFilters();

  /* ── 13. Cross-publication navigation ───────────────────────
   *
   * Clicking a "↗ Journal version", "↗ Conference version",
   * "⚠ Erratum", or "⚠ Erratum of" badge:
   *   1. Resets section filter / search if target is hidden
   *   2. Smooth-scrolls to the target row
   *   3. Flashes the full <li> row for 2 s
   * ────────────────────────────────────────────────────────── */
  document.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-goto]");
    if (!btn) return;
    const targetKey = btn.dataset.goto;
    if (!targetKey) return;

    /* Find target .pub-item by data-key */
    const target = document.querySelector('.pub-item[data-key="' + targetKey + '"]');
    if (!target) return;

    const row = getRow(target);

    /* Ensure the target's section is visible */
    const targetSect = target.closest(".pub-section");
    if (targetSect && targetSect.style.display === "none") {
      allSects.forEach(function (s) { s.style.display = ""; });
      filterBtns.forEach(function (b) {
        b.classList.toggle("active", b.dataset.section === "all");
      });
      activeSection = "all";
      applyFilters();
    }

    /* Ensure the row is not hidden by search / tag filter */
    if (row.style.display === "none") {
      if (searchInput) searchInput.value = "";
      searchQuery = "";
      activeKws.clear();
      Object.values(kwButtonMap).forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      applyFilters();
    }

    /* Scroll to row and flash it */
    row.scrollIntoView({ behavior: "smooth", block: "center" });
    row.classList.remove("pub-highlight");
    void row.offsetWidth;   /* force reflow */
    row.classList.add("pub-highlight");
    setTimeout(function () { row.classList.remove("pub-highlight"); }, 2000);
  });

});
