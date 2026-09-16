/* =========================================================
   Vibe Roadmap — app.js
   Side Website inside the Nova Nexus ecosystem.
   ========================================================= */
(function () {
  "use strict";

  var DATA = window.VIBE_DATA;

  /* ---------- 1. Configuration ---------- */
  var ALLOWED_PARENT_ORIGINS = [
    "https://nx-nova.vercel.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ];

  var AUTH_REQUEST_TYPE = "NOVA_NEXUS_AUTH_REQUEST";
  var AUTH_RESPONSE_TYPE = "NOVA_NEXUS_AUTH_RESPONSE";

  var STORAGE_KEY = "vibeRoadmap:completedPhases:v1";
  var AUTH_TIMEOUT_MS = 3000;

  /* ---------- 2. DOM helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "html") n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 3. Progress storage ---------- */
  var Progress = (function () {
    var done = {};
    function load() {
      try { var raw = localStorage.getItem(STORAGE_KEY); done = raw ? JSON.parse(raw) : {}; }
      catch (e) { done = {}; }
    }
    function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch (e) {} }
    function isDone(id) { return !!done[id]; }
    function set(id, v) { if (v) done[id] = true; else delete done[id]; save(); }
    function count() { return Object.keys(done).length; }
    function reset() { done = {}; save(); }
    load();
    return { isDone: isDone, set: set, count: count, reset: reset };
  })();

  var ALL_PHASES = [];
  DATA.parts.forEach(function (p) { p.phases.forEach(function (ph) { ALL_PHASES.push(ph); }); });
  var TOTAL_PHASES = ALL_PHASES.length;

  /* ---------- 4. SSO handshake ---------- */
  var gateEl = $("#gate");
  var appEl = $("#app");
  var session = null;
  var authTimeoutId = null;
  var initialized = false;

  function showGate() {
    gateEl.hidden = false;
    appEl.hidden = true;
    if (authTimeoutId) { clearTimeout(authTimeoutId); authTimeoutId = null; }
  }

  function showApp() {
    gateEl.hidden = true;
    appEl.hidden = false;
    document.body.style.overflow = "";
    if (authTimeoutId) { clearTimeout(authTimeoutId); authTimeoutId = null; }
    if (!initialized) { initialized = true; initApp(); }
  }

  function decodeJwtPayload(token) {
    try {
      var parts = token.split(".");
      if (parts.length !== 3) return null;
      var payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (payload.length % 4) payload += "=";
      var decoded = atob(payload);
      try { decoded = decodeURIComponent(escape(decoded)); } catch (_) {}
      return JSON.parse(decoded);
    } catch (e) {
      console.warn("[Vibe Roadmap] Could not decode token:", e);
      return null;
    }
  }

  function handleAuthResponse(data) {
    if (!data || !data.token) { showGate(); return; }
    var payload = decodeJwtPayload(data.token);
    if (!payload) { showGate(); return; }
    var now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) { showGate(); return; }
    session = {
      uid: payload.user_id || payload.sub || data.uid,
      email: payload.email || data.email || "",
      name: (payload.name || "").trim(),
      token: data.token,
      exp: payload.exp
    };
    showApp();
  }

  function requestAuthFromOpener() {
    if (!window.opener) { showGate(); return; }
    try {
      ALLOWED_PARENT_ORIGINS.forEach(function (origin) {
        try { window.opener.postMessage({ type: AUTH_REQUEST_TYPE }, origin); }
        catch (e) {}
      });
    } catch (e) { showGate(); return; }
    authTimeoutId = setTimeout(function () {
      if (!session) showGate();
    }, AUTH_TIMEOUT_MS);
  }

  window.addEventListener("message", function (event) {
    if (!ALLOWED_PARENT_ORIGINS.includes(event.origin)) return;
    var d = event.data;
    if (!d || d.type !== AUTH_RESPONSE_TYPE) return;
    handleAuthResponse(d);
  });

  requestAuthFromOpener();

  /* ---------- 5. Icons ---------- */
  var ICONS = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.5 4.5" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.36-1.36" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M4 12l5 5L20 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3v18M5 4h11l-2.5 3.5L16 11H5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function difficultyClass(text) {
    var t = (text || "").toLowerCase();
    if (t.indexOf("advanced") !== -1) return "pill-advanced";
    if (t.indexOf("intermediate") !== -1) return "pill-intermediate";
    if (t.indexOf("beginner") !== -1) return "pill-beginner";
    if (t.indexOf("all levels") !== -1) return "pill-all-levels";
    return "";
  }

  /* ---------- 6. Station rendering ---------- */
  function renderStation(phase) {
    var station = el("article", { class: "station", id: phase.id });
    if (Progress.isDone(phase.id)) station.classList.add("is-done");

    station.appendChild(el("div", { class: "station-node" }, String(phase.number)));

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
    top.appendChild(el("span", { class: "pill " + difficultyClass(phase.difficulty) }, escapeHtml(phase.difficulty)));
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

    var chev = el("div", { class: "station-chevron" });
    chev.innerHTML = ICONS.chevron;
    chev.addEventListener("click", function () { toggleOpen(station); });
    head.appendChild(chev);

    card.appendChild(head);

    var panel = el("div", { class: "station-panel" });
    var inner = el("div", { class: "station-panel-inner prose" });
    inner.innerHTML = phase.bodyHtml;

    if (phase.milestoneHtml) {
      var mBox = el("div", { class: "milestone-box" });
      var mIcon = el("div", { class: "milestone-icon" });
      mIcon.innerHTML = ICONS.flag;
      mBox.appendChild(mIcon);
      var mText = el("div");
      mText.appendChild(el("div", { class: "milestone-label" }, "Milestone — move on when"));
      mText.appendChild(el("div", { class: "milestone-text" }, phase.milestoneHtml));
      mBox.appendChild(mText);
      inner.appendChild(mBox);
    }
    if (phase.nextLabel) {
      inner.appendChild(el("div", { class: "next-line" }, "Next stop — <b>" + phase.nextLabel + "</b>"));
    }

    panel.appendChild(inner);
    card.appendChild(panel);
    station.appendChild(card);
    return station;
  }

  function toggleOpen(station, force) {
    var open = force !== undefined ? force : !station.classList.contains("is-open");
    station.classList.toggle("is-open", open);
  }

  function toggleDone(phase, station, checkBtn) {
    var newVal = !Progress.isDone(phase.id);
    Progress.set(phase.id, newVal);
    station.classList.toggle("is-done", newVal);
    checkBtn.setAttribute("aria-pressed", newVal ? "true" : "false");
    updateProgressUI();
    if (newVal) showToast("Phase " + phase.number + " complete — " + Progress.count() + "/" + TOTAL_PHASES + " done");
  }

  /* ---------- 7. Route rendering ---------- */
  function renderRoute() {
    var track = $("#routeTrack");
    track.innerHTML = "";
    track.appendChild(el("div", { class: "spine" }));

    DATA.parts.forEach(function (part) {
      var header = el("div", { class: "part-header" });
      header.appendChild(el("div", { class: "part-node" }, String(part.number)));
      var tw = el("div", { class: "part-titlewrap" });
      tw.appendChild(el("h3", {}, escapeHtml(part.title)));
      var doneInPart = part.phases.filter(function (ph) { return Progress.isDone(ph.id); }).length;
      tw.appendChild(el("div", { class: "part-meta" },
        "Phases " + part.range + " &nbsp;·&nbsp; <b class='part-done-count'>" + doneInPart + "</b>/" + part.phases.length + " complete"));
      header.appendChild(tw);
      track.appendChild(header);
      part.phases.forEach(function (ph) { track.appendChild(renderStation(ph)); });
    });
  }

  /* ---------- 8. Kit ---------- */
  function renderKit() {
    var grid = $("#kitGrid");
    grid.innerHTML = "";
    DATA.kit.forEach(function (a) {
      var card = el("button", { class: "kit-card", type: "button", "data-kit": a.id });
      card.appendChild(el("div", { class: "kit-letter" }, a.letter));
      card.appendChild(el("h3", {}, escapeHtml(a.title)));
      card.appendChild(el("p", {}, escapeHtml(a.plainText)));
      card.addEventListener("click", function () { openKitModal(a); });
      grid.appendChild(card);
    });
  }

  /* ---------- 9. FAQ ---------- */
  function renderFAQ() {
    var list = $("#faqList");
    list.innerHTML = "";
    DATA.faq.forEach(function (item) {
      var wrap = el("div", { class: "faq-item" });
      var q = el("button", { class: "faq-q", type: "button", "aria-expanded": "false" });
      q.innerHTML = "<span>" + escapeHtml(item.q) + "</span>" +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="5" x2="12" y2="19" stroke-linecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"/></svg>';
      q.addEventListener("click", function () {
        var open = wrap.classList.toggle("is-open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
      });
      wrap.appendChild(q);
      var a = el("div", { class: "faq-a" });
      var ai = el("div", { class: "faq-a-inner" });
      ai.innerHTML = item.aHtml;
      a.appendChild(ai);
      wrap.appendChild(a);
      list.appendChild(wrap);
    });
  }

  /* ---------- 10. Front matter ---------- */
  function renderFrontMatter() {
    var list = $("#principlesList");
    list.innerHTML = "";
    DATA.principles.forEach(function (p) {
      var item = el("li", { class: "principle-item" });
      item.appendChild(el("div", { class: "principle-num" }, String(p.num)));
      var tw = el("div");
      tw.appendChild(el("div", { class: "principle-title" }, p.title));
      tw.appendChild(el("div", { class: "principle-body" }, p.body));
      item.appendChild(tw);
      list.appendChild(item);
    });
    $("#closingText").innerHTML = DATA.closingHtml;
    $("#footerUpdated").textContent = DATA.meta.lastUpdated;
    $("#progressTotal").textContent = TOTAL_PHASES;
  }

  /* ---------- 11. Progress UI ---------- */
  var RING_CIRC = 97.4;
  function updateProgressUI() {
    var count = Progress.count();
    $("#progressCount").textContent = count;
    var pct = TOTAL_PHASES ? count / TOTAL_PHASES : 0;
    $("#ringFill").style.strokeDashoffset = String(RING_CIRC * (1 - pct));
    $("#footerProgress").textContent = count + " of " + TOTAL_PHASES + " phases complete";

    $all(".part-header").forEach(function (header, idx) {
      var part = DATA.parts[idx];
      if (!part) return;
      var d = part.phases.filter(function (ph) { return Progress.isDone(ph.id); }).length;
      var cEl = header.querySelector(".part-done-count");
      if (cEl) cEl.textContent = d;
    });

    var cont = $("#continueBtn");
    if (count > 0 && count < TOTAL_PHASES) cont.hidden = false;
    else cont.hidden = true;
  }

  function jumpToPhase(id) {
    var s = document.getElementById(id);
    if (!s) return;
    toggleOpen(s, true);
    setTimeout(function () {
      s.scrollIntoView({ behavior: "smooth", block: "start" });
      s.classList.add("flash-highlight");
      setTimeout(function () { s.classList.remove("flash-highlight"); }, 1700);
    }, 60);
  }

  /* ---------- 12. Toast ---------- */
  var toastTimer = null;
  function showToast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-visible"); }, 2600);
  }

  /* ---------- 13. Search ---------- */
  var SEARCH_INDEX = [];
  function buildSearchIndex() {
    ALL_PHASES.forEach(function (ph) {
      SEARCH_INDEX.push({
        type: "phase", id: ph.id,
        badge: "Ph." + String(ph.number).padStart(2, "0"),
        title: ph.title,
        text: ph.teaser + " " + ph.bodyHtml.replace(/<[^>]+>/g, " ")
      });
    });
    DATA.kit.forEach(function (a) {
      SEARCH_INDEX.push({ type: "kit", id: a.id, badge: "App." + a.letter, title: a.title, text: a.plainText });
    });
    DATA.faq.forEach(function (f, idx) {
      SEARCH_INDEX.push({ type: "faq", id: "faq-" + idx, badge: "FAQ", title: f.q, text: f.plainText });
    });
  }

  function scoreEntry(entry, q) {
    var t = entry.title.toLowerCase();
    var x = entry.text.toLowerCase();
    var s = 0;
    var i = t.indexOf(q);
    if (i === 0) s += 100;
    else if (i > -1) s += 60;
    var wb = new RegExp("\\b" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    if (wb.test(x)) s += 25;
    var xi = x.indexOf(q);
    if (xi > -1) s += 10;
    return s === 0 ? null : { score: s, textIdx: xi };
  }

  function snippetFor(entry, q, textIdx) {
    if (textIdx < 0) return escapeHtml(entry.text.slice(0, 110) + "…");
    var start = Math.max(0, textIdx - 44);
    var end = Math.min(entry.text.length, textIdx + q.length + 66);
    var snip = (start > 0 ? "…" : "") + entry.text.slice(start, end) + (end < entry.text.length ? "…" : "");
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return escapeHtml(snip).replace(re, "<mark>$1</mark>");
  }

  function runSearch(query) {
    var res = $("#searchResults");
    var q = query.trim().toLowerCase();
    res.innerHTML = "";
    if (!q) {
      res.innerHTML = '<div class="search-empty">Type to search across every phase, appendix and FAQ.</div>';
      return;
    }
    var matches = [];
    SEARCH_INDEX.forEach(function (e) {
      var r = scoreEntry(e, q);
      if (r) matches.push({ e: e, score: r.score, textIdx: r.textIdx });
    });
    matches.sort(function (a, b) { return b.score - a.score; });
    matches = matches.slice(0, 24);
    if (!matches.length) {
      res.innerHTML = '<div class="search-empty">No matches for "' + escapeHtml(query) + '"</div>';
      return;
    }
    var groups = { phase: [], kit: [], faq: [] };
    matches.forEach(function (m) { groups[m.e.type].push(m); });
    var labels = { phase: "Phases", kit: "Appendices", faq: "FAQ" };
    ["phase", "kit", "faq"].forEach(function (type) {
      if (!groups[type].length) return;
      res.appendChild(el("div", { class: "search-group-label" }, labels[type]));
      groups[type].forEach(function (m) {
        var btn = el("button", { class: "search-result", type: "button" });
        btn.appendChild(el("span", { class: "search-result-badge" }, m.e.badge));
        var tw = el("div", { style: "min-width:0;" });
        tw.appendChild(el("div", { class: "search-result-title" }, escapeHtml(m.e.title)));
        var snip = el("div", { class: "search-result-snippet" });
        snip.innerHTML = snippetFor(m.e, q, m.textIdx);
        tw.appendChild(snip);
        btn.appendChild(tw);
        btn.addEventListener("click", function () { goToResult(m.e); });
        res.appendChild(btn);
      });
    });
  }

  function goToResult(entry) {
    closeSearch();
    if (entry.type === "phase") jumpToPhase(entry.id);
    else if (entry.type === "kit") {
      var a = DATA.kit.find(function (x) { return x.id === entry.id; });
      if (a) {
        document.getElementById("kit").scrollIntoView({ behavior: "smooth" });
        setTimeout(function () { openKitModal(a); }, 350);
      }
    } else if (entry.type === "faq") {
      var idx = parseInt(entry.id.replace("faq-", ""), 10);
      var items = $all(".faq-item");
      if (items[idx]) {
        items[idx].classList.add("is-open");
        items[idx].querySelector(".faq-q").setAttribute("aria-expanded", "true");
        setTimeout(function () { items[idx].scrollIntoView({ behavior: "smooth", block: "center" }); }, 60);
      }
    }
  }

  var searchToggle = $("#searchToggle");
  var searchPanel = $("#searchPanel");
  var searchInput = $("#searchInput");
  function openSearch() {
    searchPanel.hidden = false;
    searchToggle.setAttribute("aria-expanded", "true");
    runSearch(searchInput.value);
    setTimeout(function () { searchInput.focus(); }, 10);
  }
  function closeSearch() {
    searchPanel.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
  }

  /* ---------- 14. Modal ---------- */
  var modalOverlay, modalBox;
  function setupModal() {
    modalOverlay = $("#modalOverlay");
    modalBox = $("#modalBox");
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }
  function openKitModal(a) {
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
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  /* ---------- 15. Scroll bar ---------- */
  function onScroll() {
    var d = document.documentElement;
    var st = d.scrollTop || document.body.scrollTop;
    var h = d.scrollHeight - d.clientHeight;
    var p = h > 0 ? (st / h) * 100 : 0;
    $("#scrollFill").style.width = p + "%";
  }

  /* ---------- 16. Stat animation ---------- */
  function animateStats() {
    $all(".stat-cell .num").forEach(function (node) {
      var target = parseInt(node.getAttribute("data-target"), 10) || 0;
      var start = null;
      var dur = 650;
      function frame(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        node.textContent = Math.round(p * target);
        if (p < 1) requestAnimationFrame(frame);
        else node.textContent = target;
      }
      requestAnimationFrame(frame);
    });
  }

  /* ---------- 17. Profile chip ---------- */
  function fillProfile() {
    if (!session) return;
    var email = session.email || "";
    var fallback = email.split("@")[0] || "User";
    var display = session.name || fallback;
    $("#chipUsername").textContent = display;
    $("#chipEmail").textContent = email;
    $("#userAvatar").textContent = (display.charAt(0) || "?").toUpperCase();
  }

  /* ---------- 18. Init ---------- */
  function initApp() {
    renderFrontMatter();
    renderRoute();
    renderKit();
    renderFAQ();
    buildSearchIndex();
    updateProgressUI();
    setupModal();
    onScroll();
    animateStats();
    fillProfile();
    $("#footerYear").textContent = new Date().getFullYear();

    // Wire up all interactive listeners
    $("#continueBtn").addEventListener("click", function () {
      var next = ALL_PHASES.find(function (ph) { return !Progress.isDone(ph.id); });
      if (next) jumpToPhase(next.id);
    });

    function resetProgress() {
      if (!confirm("Reset all progress? This clears every phase you've checked off.")) return;
      Progress.reset();
      $all(".station.is-done").forEach(function (s) { s.classList.remove("is-done"); });
      $all(".station-check").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
      updateProgressUI();
      showToast("Progress reset.");
    }
    $("#resetProgressBtn").addEventListener("click", resetProgress);
    $("#footerResetBtn").addEventListener("click", resetProgress);

    $("#expandAllBtn").addEventListener("click", function () {
      $all(".station").forEach(function (s) { toggleOpen(s, true); });
    });
    $("#collapseAllBtn").addEventListener("click", function () {
      $all(".station").forEach(function (s) { toggleOpen(s, false); });
    });

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
      var v = searchInput.value;
      searchDebounce = setTimeout(function () { runSearch(v); }, 90);
    });

    // Mobile nav
    var burger = $("#navBurger");
    var mobileNav = $("#mobileNav");
    burger.addEventListener("click", function () {
      var open = mobileNav.hasAttribute("hidden");
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

    // Scroll listener
    document.addEventListener("scroll", onScroll, { passive: true });

    // Stat animation observer
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateStats(); obs.disconnect(); }
        });
      }, { threshold: 0.4 });
      var board = $("#statBoard");
      if (board) obs.observe(board);
    } else {
      animateStats();
    }
  }

})();