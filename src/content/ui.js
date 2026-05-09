// ============================================================
// ui.js — Inject and update all Claude Counter UI elements
// ============================================================

window.ClaudeUI = (function () {
  'use strict';

  const C = window.ClaudeCounterConstants;

  // ── IDs ─────────────────────────────────────────────────────
  const ID_HEADER_WIDGET  = 'cc-header-widget';
  const ID_TOKEN_VALUE    = 'cc-token-value';
  const ID_TOKEN_BAR      = 'cc-token-bar';
  const ID_CACHE_VALUE    = 'cc-cache-value';
  const ID_INPUT_WIDGET   = 'cc-input-widget';
  const ID_SESSION_BAR    = 'cc-session-bar-fill';
  const ID_SESSION_LABEL  = 'cc-session-label';
  const ID_WEEKLY_BAR     = 'cc-weekly-bar-fill';
  const ID_WEEKLY_LABEL   = 'cc-weekly-label';

  // ── Helpers ──────────────────────────────────────────────────

  function fmt(n) {
    return Number(n).toLocaleString('en-US');
  }

  function pct(frac) {
    return (frac * 100).toFixed(1) + '%';
  }

  function fmtMs(ms) {
    if (ms <= 0) return '0:00';
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function fmtDuration(ms) {
    if (ms <= 0) return '0m';
    const totalMin = Math.floor(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    const d = Math.floor(h / 24);
    const rh = h % 24;
    if (d > 0) return `${d}d ${rh}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  // ── Header widget ────────────────────────────────────────────

  function buildHeaderWidget() {
    const el = document.createElement('div');
    el.id = ID_HEADER_WIDGET;
    el.className = 'cc-header-widget';
    el.innerHTML = `
      <div class="cc-token-block">
        <span class="cc-label">TOKENS</span>
        <span id="${ID_TOKEN_VALUE}" class="cc-value">~0</span>
        <div class="cc-bar-track cc-token-track">
          <div id="${ID_TOKEN_BAR}" class="cc-bar-fill" style="width:0%"></div>
        </div>
        <span class="cc-sublabel">/ 200k</span>
      </div>
      <div class="cc-divider"></div>
      <div class="cc-cache-block">
        <span class="cc-label">CACHE</span>
        <span id="${ID_CACHE_VALUE}" class="cc-value cc-cache-value">–</span>
      </div>
    `;
    return el;
  }

  function injectHeaderWidget() {
    if (document.getElementById(ID_HEADER_WIDGET)) return true;

    // Try to find the top nav bar
    const navCandidates = [
      'header',
      'nav',
      '[role="banner"]',
      '[class*="TopBar"]',
      '[class*="navbar"]',
      '[class*="Header"]',
      '[data-testid="chat-header"]',
      '[class*="ConversationHeader"]',
    ];

    let nav = null;
    for (const sel of navCandidates) {
      nav = document.querySelector(sel);
      if (nav) break;
    }

    if (!nav) {
      // Floating fallback at top of viewport
      const fallback = document.createElement('div');
      fallback.id = ID_HEADER_WIDGET + '-fallback-wrap';
      fallback.style.cssText = `
        position: fixed; top: 0; right: 0; z-index: 99999;
        display: flex; align-items: center;
      `;
      const widget = buildHeaderWidget();
      fallback.appendChild(widget);
      document.body.appendChild(fallback);
      return true;
    }

    const widget = buildHeaderWidget();
    nav.style.position = 'relative';

    // Try to insert before the last child (usually action buttons)
    const lastChild = nav.lastElementChild;
    if (lastChild) {
      nav.insertBefore(widget, lastChild);
    } else {
      nav.appendChild(widget);
    }
    return true;
  }

  // ── Input area widget ────────────────────────────────────────

  function buildInputWidget() {
    const el = document.createElement('div');
    el.id = ID_INPUT_WIDGET;
    el.className = 'cc-input-widget';
    el.innerHTML = `
      <div class="cc-usage-row">
        <span class="cc-usage-label">Session</span>
        <div class="cc-bar-track">
          <div id="${ID_SESSION_BAR}" class="cc-bar-fill cc-bar-session" style="width:0%"></div>
        </div>
        <span id="${ID_SESSION_LABEL}" class="cc-usage-stat">–</span>
      </div>
      <div class="cc-usage-row">
        <span class="cc-usage-label">Weekly</span>
        <div class="cc-bar-track">
          <div id="${ID_WEEKLY_BAR}" class="cc-bar-fill cc-bar-weekly" style="width:0%"></div>
        </div>
        <span id="${ID_WEEKLY_LABEL}" class="cc-usage-stat">–</span>
      </div>
    `;
    return el;
  }

  function injectInputWidget() {
    if (document.getElementById(ID_INPUT_WIDGET)) return true;

    const inputCandidates = [
      '[data-testid="chat-input-container"]',
      'fieldset',
      '[class*="InputBar"]',
      '[class*="input-area"]',
      '[class*="composer"]',
      '[class*="Composer"]',
      'form',
    ];

    let container = null;
    for (const sel of inputCandidates) {
      container = document.querySelector(sel);
      if (container) break;
    }

    if (!container) return false;

    const widget = buildInputWidget();
    container.insertAdjacentElement('beforebegin', widget);
    return true;
  }

  // ── Public update functions ──────────────────────────────────

  function updateTokens(count, percent, color) {
    const valEl  = document.getElementById(ID_TOKEN_VALUE);
    const barEl  = document.getElementById(ID_TOKEN_BAR);
    if (!valEl || !barEl) return;

    valEl.textContent = `~${fmt(count)}`;
    valEl.style.color = color;
    barEl.style.width = (percent * 100).toFixed(2) + '%';
    barEl.style.backgroundColor = color;
  }

  function updateCache(remainingMs) {
    const el = document.getElementById(ID_CACHE_VALUE);
    if (!el) return;
    if (remainingMs <= 0) {
      el.textContent = 'expired';
      el.style.color = C.COLOR_MUTED;
    } else {
      el.textContent = `cached ${fmtMs(remainingMs)}`;
      el.style.color = C.COLOR_GREEN;
    }
  }

  function updateSession(usedFrac, resetMs) {
    const barEl   = document.getElementById(ID_SESSION_BAR);
    const labelEl = document.getElementById(ID_SESSION_LABEL);
    if (!barEl || !labelEl) return;

    const pctVal = Math.min(usedFrac, 1) * 100;
    barEl.style.width = pctVal.toFixed(2) + '%';
    barEl.style.backgroundColor = pctVal > 90 ? C.COLOR_RED
      : pctVal > 70 ? C.COLOR_YELLOW : C.COLOR_PROGRESS;

    labelEl.textContent = `${pct(usedFrac)} · resets in ${fmtDuration(resetMs)}`;
  }

  function updateWeekly(usedFrac, resetMs) {
    const barEl   = document.getElementById(ID_WEEKLY_BAR);
    const labelEl = document.getElementById(ID_WEEKLY_LABEL);
    if (!barEl || !labelEl) return;

    const pctVal = Math.min(usedFrac, 1) * 100;
    barEl.style.width = pctVal.toFixed(2) + '%';
    barEl.style.backgroundColor = pctVal > 90 ? C.COLOR_RED
      : pctVal > 70 ? C.COLOR_YELLOW : C.COLOR_PROGRESS;

    labelEl.textContent = `${pct(usedFrac)} · resets in ${fmtDuration(resetMs)}`;
  }

  function isInjected() {
    return (
      !!document.getElementById(ID_HEADER_WIDGET) ||
      !!document.getElementById(ID_HEADER_WIDGET + '-fallback-wrap')
    );
  }

  function inject() {
    injectHeaderWidget();
    injectInputWidget();
  }

  function removeAll() {
    [
      ID_HEADER_WIDGET,
      ID_HEADER_WIDGET + '-fallback-wrap',
      ID_INPUT_WIDGET,
    ].forEach(id => document.getElementById(id)?.remove());
  }

  return {
    inject,
    removeAll,
    isInjected,
    updateTokens,
    updateCache,
    updateSession,
    updateWeekly,
  };
})();
