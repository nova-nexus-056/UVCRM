/* =========================================================
   Nova Nexus SSO Gate for CodeYatra
   Runs before content.js and app.js.

   Flow:
   - If launched from Nova Nexus (window.opener exists):
       sends NOVA_NEXUS_AUTH_REQUEST, awaits token.
   - If token received within 3s: hides the gate, lets the app run.
   - If no opener (direct URL) OR timeout: shows "Access via
     Nova Nexus only" message.
   ========================================================= */
(function () {
  "use strict";

  var ALLOWED_PARENT_ORIGINS = [
    "https://nx-nova.vercel.app",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ];
  var AUTH_REQUEST_TYPE = "NOVA_NEXUS_AUTH_REQUEST";
  var AUTH_RESPONSE_TYPE = "NOVA_NEXUS_AUTH_RESPONSE";
  var TIMEOUT_MS = 3000;

  var gate = document.getElementById("ssoGate");
  var loading = document.getElementById("ssoGateLoading");
  var blocked = document.getElementById("ssoGateBlocked");
  var timeoutId = null;
  var settled = false;

  function hideGate() {
    if (settled) return;
    settled = true;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    if (gate) {
      gate.classList.add("sso-gate-hide");
      setTimeout(function () { gate.style.display = "none"; }, 550);
    }
  }

  function showBlocked() {
    if (settled) return;
    settled = true;
    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
    if (loading) loading.hidden = true;
    if (blocked) blocked.hidden = false;
  }

  function isTokenPlausible(token) {
    if (!token || typeof token !== "string") return false;
    var parts = token.split(".");
    if (parts.length !== 3) return false;
    try {
      var payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      while (payload.length % 4) payload += "=";
      var decoded = atob(payload);
      try { decoded = decodeURIComponent(escape(decoded)); } catch (_) { /* ignore */ }
      var data = JSON.parse(decoded);
      if (data.exp) {
        var now = Math.floor(Date.now() / 1000);
        if (data.exp < now) return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  window.addEventListener("message", function (event) {
    if (ALLOWED_PARENT_ORIGINS.indexOf(event.origin) === -1) return;
    var d = event.data;
    if (!d || d.type !== AUTH_RESPONSE_TYPE) return;
    if (isTokenPlausible(d.token)) {
      hideGate();
    } else {
      showBlocked();
    }
  });

  if (window.opener) {
    try {
      ALLOWED_PARENT_ORIGINS.forEach(function (origin) {
        try { window.opener.postMessage({ type: AUTH_REQUEST_TYPE }, origin); }
        catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
    timeoutId = setTimeout(showBlocked, TIMEOUT_MS);
  } else {
    showBlocked();
  }
})();