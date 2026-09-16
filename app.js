(function () {
  "use strict";

  var DATA = window.ROADMAP_DATA;
  var STORAGE_KEY = "codeyatra:completedPhases:v1";
  var ADVISORY_KEY = "codeyatra:advisoryDismissed:v1";

  // =========================================================================
  // Small DOM helpers
  // =========================================================================
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (html !== undefined) node.innerHTML = html;
    return node;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // =========================================================================
  // Progress storage
  // =========================================================================
  var Progress = (function () {
    var done = {};
    function load() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        done = raw ? JSON.parse(raw) : {};
      } catch (e) { done = {}; }
    }
    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch (e) {}
    }
    function isDone(id) { return !!done[id]; }
    function set(id, val) {
      if (val) done[id] = true; else delete done[id];
      save();
    }
    function count() { return Object.keys(done).length; }
    function reset() { done = {}; save(); }
    load();
    return { isDone: isDone, set: set, count: count, reset: reset };
  })();

  // total phase count, flattened, in document order
  var ALL_PHASES = [];
  DATA.parts.forEach(function (p) { p.phases.forEach(function (ph) { ALL_PHASES.push(ph); }); });
  var TOTAL_PHASES = ALL_PHASES.length;

  // =========================================================================
  // BOOT SEQUENCE
  // =========================================================================
  (function boot() {
    var bootEl = $("#boot");
    var fill = $("#bootBarFill");
    var pctEl = $("#bootPct");
    var logEl = $("#bootLog");
    var skipBtn = $("#bootSkip");
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var DURATION = reduced ? 900 : 5000;

    document.body.classList.add("no-scroll");

    var lines = [
      "Connecting to server…",
      "Authenticating vibe check… <b>passed</b>",
      "Resolving 28 phases across 8 parts…",
      "Waking up the event loop…",
      "Untangling one merge conflict…",
      "Brewing chai ☕…",
      "Mounting yatra-engine.js…",
      "Done."
    ];
    var schedule = [];
    var n = lines.length;
    for (var i = 0; i < n; i++) {
      schedule.push(Math.round((i / (n - 1)) * (DURATION - 260)));
    }
    var timers = [];
    schedule.forEach(function (t, idx) {
      timers.push(setTimeout(function () {
        var line = el("div", { class: "boot-log-line" });
        line.innerHTML = "&gt; " + lines[idx];
        logEl.appendChild(line);
        while (logEl.children.length > 3) logEl.removeChild(logEl.firstChild);
      }, t));
    });

    var start = null;
    var rafId = null;
    function tick(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      fill.style.width = pct + "%";
      pctEl.textContent = pct + "%";
      if (elapsed < DURATION) {
        rafId = requestAnimationFrame(tick);
      } else {
        finish();
      }
    }
    rafId = requestAnimationFrame(tick);

    var finished = false;
    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      fill.style.width = "100%";
      pctEl.textContent = "100%";
      setTimeout(function () {
        bootEl.classList.add("boot-hide");
        document.body.classList.remove("no-scroll");
        setTimeout(function () { bootEl.style.display = "none"; }, 750);
      }, 260);
    }

    skipBtn.addEventListener("click", function () {
      var remaining = Math.max(0, DURATION - (performance.now() - (start || 0)));
      // give a minimum graceful moment rather than an abrupt cut
      timers.forEach(clearTimeout);
      logEl.innerHTML = "";
      ["Connecting to server…", "Done."].forEach(function (t) {
        var line = el("div", { class: "boot-log-line" });
        line.innerHTML = "&gt; " + t;
        logEl.appendChild(line);
      });
      finish();
    });
  })();

  // =========================================================================
  // Difficulty pill classification
  // =========================================================================
  function difficultyClass(text) {
    var t = (text || "").toLowerCase();
    if (t.indexOf("advanced") !== -1) return "pill-advanced";
    if (t.indexOf("intermediate") !== -1) return "pill-intermediate";
    if (t.indexOf("beginner") !== -1) return "pill-beginner";
    if (t.indexOf("professional") !== -1) return "pill-professional";
    if (t.indexOf("all levels") !== -1) return "pill-all-levels";
    return "";
  }

  var ICONS = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.36-1.36" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    milestone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3v18M5 4h11l-2.5 3.5L16 11H5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // =========================================================================
  // RENDER: a single phase "station"
  // =========================================================================
  function renderStation(phase) {
    var station = el("article", { class: "station", id: phase.id, "data-phase-id": phase.id });
    if (Progress.isDone(phase.id)) station.classList.add("is-done");

    var node = el("div", { class: "station-node" }, String(phase.number));
    station.appendChild(node);

    var card = el("div", { class: "station-card" });

    var head = el("div", { class: "station-head" });

    var checkBtn = el("button", {
      class: "station-check", type: "button",
      "aria-pressed": Progress.isDone(phase.id) ? "true" : "false",
      "aria-label": "Mark phase " + phase.number + " complete"
    });
    checkBtn.innerHTML = ICONS.check;
    checkBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleDone(phase, station, checkBtn);
    });
    head.appendChild(checkBtn);

    var main = el("div", { class: "station-main" });
    var top = el("div", { class: "station-toprow" });
    top.appendChild(el("span", { class: "station-phaselabel" }, "PHASE " + String(phase.number).padStart(2, "0")));
    var pillClass = difficultyClass(phase.difficulty);
    top.appendChild(el("span", { class: "pill " + pillClass }, escapeHtml(phase.difficulty)));
    main.appendChild(top);
    main.appendChild(el("h3", { class: "station-title" }, escapeHtml(phase.title)));
    main.appendChild(el("p", { class: "station-teaser" }, escapeHtml(phase.teaser)));

    var metaRow = el("div", { class: "station-meta-row" });
    var m1 = el("span", { class: "station-meta" });
    m1.innerHTML = ICONS.clock + "<span>" + escapeHtml(phase.time) + "</span>";
    metaRow.appendChild(m1);
    var m2 = el("span", { class: "station-meta" });
    m2.innerHTML = ICONS.link + "<span>" + escapeHtml(phase.prerequisites) + "</span>";
    metaRow.appendChild(m2);
    main.appendChild(metaRow);

    main.addEventListener("click", function () { toggleOpen(station); });
    head.appendChild(main);

    var chevron = el("div", { class: "station-chevron" });
    chevron.innerHTML = ICONS.chevron;
    chevron.addEventListener("click", function () { toggleOpen(station); });
    head.appendChild(chevron);

    card.appendChild(head);

    var panel = el("div", { class: "station-panel" });
    var panelInner = el("div", { class: "station-panel-inner prose" });
    panelInner.innerHTML = phase.bodyHtml;

    if (phase.milestoneHtml) {
      var mBox = el("div", { class: "milestone-box" });
      var mIcon = el("div", { class: "milestone-icon" });
      mIcon.innerHTML = ICONS.milestone;
      mBox.appendChild(mIcon);
      var mText = el("div");
      mText.appendChild(el("div", { class: "milestone-label" }, "Boarding pass — you may proceed when"));
      mText.appendChild(el("div", { class: "milestone-text" }, phase.milestoneHtml));
      mBox.appendChild(mText);
      panelInner.appendChild(mBox);
    }
    if (phase.nextLabel) {
      panelInner.appendChild(el("div", { class: "next-line" }, "Next stop — <b>" + phase.nextLabel + "</b>"));
    }

    panel.appendChild(panelInner);
    card.appendChild(panel);
    station.appendChild(card);
    return station;
  }

  function toggleOpen(station, forceOpen) {
    var shouldOpen = forceOpen !== undefined ? forceOpen : !station.classList.contains("is-open");
    station.classList.toggle("is-open", shouldOpen);
  }

  function toggleDone(phase, station, checkBtn) {
    var newVal = !Progress.isDone(phase.id);
    Progress.set(phase.id, newVal);
    station.classList.toggle("is-done", newVal);
    checkBtn.setAttribute("aria-pressed", newVal ? "true" : "false");
    updateProgressUI();
    if (newVal) {
      showToast("Phase " + phase.number + " complete — " + Progress.count() + "/" + TOTAL_PHASES + " done");
    }
  }

  // =========================================================================
  // RENDER: full route track (parts -> phases, with branch/remerge at 20-24)
  // =========================================================================
  function renderRoute() {
    var track = $("#routeTrack");
    track.innerHTML = "";
    track.appendChild(el("div", { class: "spine" }));

    DATA.parts.forEach(function (part) {
      var header = el("div", { class: "part-header" });
      header.appendChild(el("div", { class: "part-node" }, String(part.number)));
      var titlewrap = el("div", { class: "part-titlewrap" });
      titlewrap.appendChild(el("h3", {}, escapeHtml(part.title)));
      var doneInPart = part.phases.filter(function (ph) { return Progress.isDone(ph.id); }).length;
      titlewrap.appendChild(el("div", { class: "part-meta" },
        "Phases " + part.phaseRange + " &nbsp;·&nbsp; <b class='part-done-count'>" + doneInPart + "</b>/" + part.phases.length + " complete"));
      header.appendChild(titlewrap);
      track.appendChild(header);

      if (part.number === 7) {
        var note = el("div", { class: "branch-note" },
          "&#127752; <b>The road forks here.</b> Phases 21&ndash;23 are optional, parallel specialisations — pick one, two, or skip straight to Phase 24 as a full-stack generalist. They don't need to be done in order.");
        track.appendChild(note);
        var wrap = el("div", { class: "branch-wrap" });
        part.phases.forEach(function (ph) { wrap.appendChild(renderStation(ph)); });
        track.appendChild(wrap);
        var remerge = el("div", { class: "remerge-note" },
          "&#10003; <b>Roads merge back here.</b> Whether you specialised or skipped ahead, Phase 24 onward is the same path for everyone.");
        track.appendChild(remerge);
      } else {
        part.phases.forEach(function (ph) { track.appendChild(renderStation(ph)); });
      }
    });
  }

  // =========================================================================
  // RENDER: appendices grid + modal
  // =========================================================================
  var modalOverlay, modalBox;
  function renderAppendices() {
    var grid = $("#appendixGrid");
    grid.innerHTML = "";
    DATA.appendices.forEach(function (a) {
      var card = el("button", { class: "appendix-card", type: "button", "data-appendix": a.id });
      card.appendChild(el("div", { class: "appendix-letter" }, a.letter));
      card.appendChild(el("h3", {}, escapeHtml(a.title)));
      var preview = a.plainText.slice(0, 108).trim() + "…";
      card.appendChild(el("p", {}, escapeHtml(preview)));
      card.addEventListener("click", function () { openAppendixModal(a); });
      grid.appendChild(card);
    });

    modalOverlay = el("div", { class: "modal-overlay", id: "modalOverlay" });
    modalBox = el("div", { class: "modal-box" });
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  function openAppendixModal(a) {
    modalBox.innerHTML = "";
    var closeBtn = el("button", { class: "modal-close", type: "button", "aria-label": "Close" });
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="5" y1="5" x2="19" y2="19" stroke-linecap="round"/><line x1="19" y1="5" x2="5" y2="19" stroke-linecap="round"/></svg>';
    closeBtn.addEventListener("click", closeModal);
    modalBox.appendChild(closeBtn);
    modalBox.appendChild(el("div", { class: "modal-eyebrow" }, "Appendix " + a.letter));
    modalBox.appendChild(el("h2", {}, escapeHtml(a.title)));
    var body = el("div", { class: "prose" });
    body.innerHTML = a.bodyHtml;
    modalBox.appendChild(body);
    modalOverlay.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  // =========================================================================
  // RENDER: FAQ
  // =========================================================================
  function renderFAQ() {
    var list = $("#faqList");
    list.innerHTML = "";
    DATA.faq.forEach(function (item, idx) {
      var faqItem = el("div", { class: "faq-item", id: "faq-item-" + idx });
      var q = el("button", { class: "faq-q", type: "button", "aria-expanded": "false" });
      q.innerHTML = "<span>" + escapeHtml(item.q) + "</span>" +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"/></svg>';
      q.addEventListener("click", function () {
        var open = faqItem.classList.toggle("is-open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
      });
      faqItem.appendChild(q);
      var a = el("div", { class: "faq-a" });
      var aInner = el("div", { class: "faq-a-inner" });
      aInner.innerHTML = item.aHtml;
      a.appendChild(aInner);
      faqItem.appendChild(a);
      list.appendChild(faqItem);
    });
  }

  // =========================================================================
  // RENDER: front matter (how-to-use, principles, closing)
  // =========================================================================
  function renderFrontMatter() {
    $("#howToUseContent").innerHTML = DATA.howToUseHtml;

    var list = $("#principlesList");
    list.innerHTML = "";
    DATA.corePrinciples.forEach(function (p) {
      var item = el("li", { class: "principle-item" });
      item.appendChild(el("div", { class: "principle-num" }, String(p.num)));
      var textWrap = el("div");
      textWrap.appendChild(el("div", { class: "principle-title" }, p.title));
      textWrap.appendChild(el("div", { class: "principle-body" }, p.body));
      item.appendChild(textWrap);
      list.appendChild(item);
    });

    $("#closingText").innerHTML = DATA.closingHtml;
    $("#footerUpdated").textContent = DATA.meta.lastUpdated || "—";
    $("#progressTotal").textContent = TOTAL_PHASES;
  }

  // =========================================================================
  // Progress UI (header ring/pill, footer text, hero continue button)
  // =========================================================================
  var RING_CIRC = 97.4;
  function updateProgressUI() {
    var count = Progress.count();
    $("#progressCount").textContent = count;
    var pct = TOTAL_PHASES ? count / TOTAL_PHASES : 0;
    $("#ringFill").style.strokeDashoffset = String(RING_CIRC * (1 - pct));
    $("#footerProgressText").textContent = count + " of " + TOTAL_PHASES + " phases complete";

    $all(".part-header").forEach(function (header, idx) {
      var part = DATA.parts[idx];
      if (!part) return;
      var doneInPart = part.phases.filter(function (ph) { return Progress.isDone(ph.id); }).length;
      var countEl = header.querySelector(".part-done-count");
      if (countEl) countEl.textContent = doneInPart;
    });

    var continueBtn = $("#continueBtn");
    if (count > 0 && count < TOTAL_PHASES) {
      continueBtn.hidden = false;
    } else {
      continueBtn.hidden = true;
    }
  }

  $("#continueBtn").addEventListener("click", function () {
    var next = ALL_PHASES.find(function (ph) { return !Progress.isDone(ph.id); });
    if (next) jumpToPhase(next.id);
  });

  function jumpToPhase(id) {
    var stationEl = document.getElementById(id);
    if (!stationEl) return;
    toggleOpen(stationEl, true);
    setTimeout(function () {
      stationEl.scrollIntoView({ behavior: "smooth", block: "start" });
      stationEl.classList.add("flash-highlight");
      setTimeout(function () { stationEl.classList.remove("flash-highlight"); }, 1700);
    }, 60);
  }

  // =========================================================================
  // Reset progress (route controls + footer)
  // =========================================================================
  function resetProgress() {
    if (!window.confirm("Reset all progress? This clears every phase you've checked off on this device.")) return;
    Progress.reset();
    $all(".station.is-done").forEach(function (s) { s.classList.remove("is-done"); });
    $all(".station-check").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    updateProgressUI();
    showToast("Progress reset. Fresh start!");
  }
  $("#resetProgressBtn").addEventListener("click", resetProgress);
  $("#footerResetBtn").addEventListener("click", resetProgress);

  $("#expandAllBtn").addEventListener("click", function () {
    $all(".station").forEach(function (s) { toggleOpen(s, true); });
  });
  $("#collapseAllBtn").addEventListener("click", function () {
    $all(".station").forEach(function (s) { toggleOpen(s, false); });
  });

  // =========================================================================
  // Toast
  // =========================================================================
  var toastTimer = null;
  function showToast(msg) {
    var toast = $("#toast");
    toast.innerHTML = '<span class="toast-dot"></span><span>' + escapeHtml(msg) + "</span>";
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
  }

  // =========================================================================
  // SEARCH ENGINE
  // =========================================================================
  var SEARCH_INDEX = [];
  function buildSearchIndex() {
    ALL_PHASES.forEach(function (ph) {
      SEARCH_INDEX.push({
        type: "phase", id: ph.id, badge: "Ph." + String(ph.number).padStart(2, "0"),
        title: ph.title, text: ph.teaser + " " + ph.plainText
      });
    });
    DATA.appendices.forEach(function (a) {
      SEARCH_INDEX.push({
        type: "appendix", id: a.id, badge: "App." + a.letter,
        title: a.title, text: a.plainText
      });
    });
    DATA.faq.forEach(function (f, idx) {
      SEARCH_INDEX.push({
        type: "faq", id: "faq-item-" + idx, badge: "FAQ",
        title: f.q, text: f.plainText
      });
    });
  }

  function scoreEntry(entry, qLower) {
    var titleLower = entry.title.toLowerCase();
    var textLower = entry.text.toLowerCase();
    var score = 0;
    var idx = titleLower.indexOf(qLower);
    if (idx === 0) score += 100;
    else if (idx > -1) score += 60;
    var wordBoundary = new RegExp("\\b" + qLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (wordBoundary.test(textLower)) score += 25;
    var textIdx = textLower.indexOf(qLower);
    if (textIdx > -1) score += 10;
    if (score === 0) return null;
    return { score: score, textIdx: textIdx };
  }

  function snippetFor(entry, qLower, textIdx) {
    if (textIdx < 0) return entry.text.slice(0, 110) + "…";
    var start = Math.max(0, textIdx - 44);
    var end = Math.min(entry.text.length, textIdx + qLower.length + 66);
    var snippet = (start > 0 ? "…" : "") + entry.text.slice(start, end) + (end < entry.text.length ? "…" : "");
    var re = new RegExp("(" + qLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return escapeHtml(snippet).replace(re, "<mark>$1</mark>");
  }

  var TYPE_LABELS = { phase: "Phases", appendix: "Appendices", faq: "FAQ" };

  function runSearch(query) {
    var resultsEl = $("#searchResults");
    var q = query.trim().toLowerCase();
    resultsEl.innerHTML = "";
    if (!q) {
      resultsEl.innerHTML = '<div class="search-empty">Type to search across every phase, appendix and FAQ answer.</div>';
      return;
    }
    var matches = [];
    SEARCH_INDEX.forEach(function (entry) {
      var r = scoreEntry(entry, q);
      if (r) matches.push({ entry: entry, score: r.score, textIdx: r.textIdx });
    });
    matches.sort(function (a, b) { return b.score - a.score; });
    matches = matches.slice(0, 24);

    if (!matches.length) {
      resultsEl.innerHTML = '<div class="search-empty">No matches for “' + escapeHtml(query) + '” — try a shorter word.</div>';
      return;
    }

    var grouped = {};
    matches.forEach(function (m) {
      var t = m.entry.type;
      grouped[t] = grouped[t] || [];
      grouped[t].push(m);
    });

    ["phase", "appendix", "faq"].forEach(function (type) {
      if (!grouped[type]) return;
      resultsEl.appendChild(el("div", { class: "search-group-label" }, TYPE_LABELS[type]));
      grouped[type].forEach(function (m) {
        var btn = el("button", { class: "search-result", type: "button" });
        var badge = el("span", { class: "search-result-badge" }, m.entry.badge);
        var textWrap = el("div", { style: "min-width:0;" });
        textWrap.appendChild(el("div", { class: "search-result-title" }, escapeHtml(m.entry.title)));
        var snippet = el("div", { class: "search-result-snippet" });
        snippet.innerHTML = snippetFor(m.entry, q, m.textIdx);
        textWrap.appendChild(snippet);
        btn.appendChild(badge);
        btn.appendChild(textWrap);
        btn.addEventListener("click", function () { goToResult(m.entry); });
        resultsEl.appendChild(btn);
      });
    });
  }

  function goToResult(entry) {
    closeSearch();
    if (entry.type === "phase") {
      jumpToPhase(entry.id);
    } else if (entry.type === "appendix") {
      var a = DATA.appendices.find(function (x) { return x.id === entry.id; });
      if (a) {
        document.getElementById("appendices").scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(function () { openAppendixModal(a); }, 350);
      }
    } else if (entry.type === "faq") {
      var faqEl = document.getElementById(entry.id);
      if (faqEl) {
        faqEl.classList.add("is-open");
        faqEl.querySelector(".faq-q").setAttribute("aria-expanded", "true");
        setTimeout(function () {
          faqEl.scrollIntoView({ behavior: "smooth", block: "center" });
          faqEl.classList.add("flash-highlight");
          setTimeout(function () { faqEl.classList.remove("flash-highlight"); }, 1700);
        }, 60);
      }
    }
  }

  // search open/close wiring
  var searchToggle = $("#searchToggle");
  var searchPanel = $("#searchPanel");
  var searchInput = $("#searchInput");
  function openSearch() {
    searchPanel.hidden = false;
    searchPanel.setAttribute("data-active", "1");
    searchToggle.setAttribute("aria-expanded", "true");
    runSearch(searchInput.value);
    setTimeout(function () { searchInput.focus(); }, 10);
  }
  function closeSearch() {
    searchPanel.hidden = true;
    searchPanel.removeAttribute("data-active");
    searchToggle.setAttribute("aria-expanded", "false");
  }
  searchToggle.addEventListener("click", function () {
    if (searchPanel.hidden) openSearch(); else closeSearch();
  });
  document.addEventListener("click", function (e) {
    if (!searchPanel.hidden && !e.target.closest(".search-wrap")) closeSearch();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
    if ((e.key === "/" || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) &&
        document.activeElement !== searchInput && !e.target.closest("input,textarea")) {
      e.preventDefault();
      openSearch();
    }
  });
  var searchDebounce = null;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchDebounce);
    var val = searchInput.value;
    searchDebounce = setTimeout(function () { runSearch(val); }, 90);
  });

  // =========================================================================
  // Advisory dismiss
  // =========================================================================
  (function advisory() {
    var box = $("#advisory");
    var closeBtn = $("#advisoryClose");
    try {
      if (localStorage.getItem(ADVISORY_KEY) === "1") box.classList.add("is-dismissed");
    } catch (e) {}
    closeBtn.addEventListener("click", function () {
      box.classList.add("is-dismissed");
      try { localStorage.setItem(ADVISORY_KEY, "1"); } catch (e) {}
    });
  })();

  // =========================================================================
  // Mobile nav
  // =========================================================================
  var burger = $("#navBurger");
  var mobileNav = $("#mobileNav");
  burger.addEventListener("click", function () {
    var open = mobileNav.hasAttribute("hidden") ? true : false;
    if (open) { mobileNav.removeAttribute("hidden"); mobileNav.classList.add("open"); }
    else { mobileNav.setAttribute("hidden", ""); mobileNav.classList.remove("open"); }
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $all("#mobileNav a").forEach(function (a) {
    a.addEventListener("click", function () {
      mobileNav.setAttribute("hidden", "");
      mobileNav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // =========================================================================
  // Scroll progress bar
  // =========================================================================
  function onScroll() {
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? (scrollTop / height) * 100 : 0;
    $("#scrollFill").style.width = pct + "%";
  }
  document.addEventListener("scroll", onScroll, { passive: true });

  // =========================================================================
  // Hero split-flap counters
  // =========================================================================
  function animateFlaps() {
    $all(".flap").forEach(function (flap) {
      var target = parseInt(flap.getAttribute("data-target"), 10) || 0;
      var digits = $all(".flap-digit", flap);
      var str = String(target).padStart(digits.length, "0");
      var duration = 650;
      var startTime = null;
      function frame(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min(1, (ts - startTime) / duration);
        var current = Math.round(p * target);
        var curStr = String(current).padStart(digits.length, "0");
        digits.forEach(function (d, i) { d.textContent = curStr[i]; });
        if (p < 1) requestAnimationFrame(frame);
        else digits.forEach(function (d, i) { d.textContent = str[i]; });
      }
      requestAnimationFrame(frame);
    });
  }
  if ("IntersectionObserver" in window) {
    var flapObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateFlaps(); obs.disconnect(); }
      });
    }, { threshold: 0.4 });
    var board = $("#statBoard");
    if (board) flapObserver.observe(board);
  } else {
    animateFlaps();
  }

  // =========================================================================
  // INIT
  // =========================================================================
  renderFrontMatter();
  renderRoute();
  renderAppendices();
  renderFAQ();
  buildSearchIndex();
  updateProgressUI();
  onScroll();
  $("#footerYear").textContent = new Date().getFullYear();

})();
