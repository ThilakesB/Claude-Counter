// ============================================================
// main.js — Entry point for Claude Counter content script
// Orchestrates: injection, DOM watching, tick loop
// ============================================================

(function () {
  'use strict';

  const C = window.ClaudeCounterConstants;

  // ── 1. Inject bridge (intercept fetch in page context) ───────
  window.ClaudeBridgeClient.init();

  // ── 2. State ─────────────────────────────────────────────────
  let tickTimer     = null;
  let injectAttempts = 0;
  const MAX_INJECT_ATTEMPTS = 40;

  // ── 3. Attempt UI injection with retry ───────────────────────

  function tryInject() {
    window.ClaudeUI.inject();
    const ok = window.ClaudeUI.isInjected();
    if (!ok && injectAttempts < MAX_INJECT_ATTEMPTS) {
      injectAttempts++;
      setTimeout(tryInject, 500);
    } else {
      injectAttempts = 0;
      if (!tickTimer) startTick();
    }
  }

  // ── 4. Tick — updates all UI every second ────────────────────

  function startTick() {
    tickTimer = setInterval(tick, C.TICK_INTERVAL_MS);
    tick(); // immediate first tick
  }

  function tick() {
    // ── Token count ───────────────────────────────────────────
    const { count, percent, color } = window.ClaudeTokens.countCurrentTokens();
    window.ClaudeUI.updateTokens(count, percent, color);

    // ── Cache timer ───────────────────────────────────────────
    const state = window.ClaudeBridgeClient.state;
    const cacheElapsed = state.lastMessageTs > 0
      ? Date.now() - state.lastMessageTs
      : Infinity;
    const cacheRemaining = Math.max(0, C.CACHE_DURATION_MS - cacheElapsed);
    window.ClaudeUI.updateCache(cacheRemaining);

    // ── Session & Weekly usage ────────────────────────────────
    window.ClaudeUI.updateSession(
      state.sessionUsedFrac,
      state.sessionResetMs
    );
    window.ClaudeUI.updateWeekly(
      state.weeklyUsedFrac,
      state.weeklyResetMs
    );

    // Decrement reset counters
    if (state.sessionResetMs > 0) state.sessionResetMs -= C.TICK_INTERVAL_MS;
    if (state.weeklyResetMs  > 0) state.weeklyResetMs  -= C.TICK_INTERVAL_MS;
  }

  // ── 5. Watch DOM mutations (SPA navigation) ──────────────────

  let debounceTimer = null;

  const observer = new MutationObserver((mutations) => {
    // Re-check if our widgets have been removed by a SPA navigation
    if (!window.ClaudeUI.isInjected()) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        injectAttempts = 0;
        tryInject();
      }, 800);
      return;
    }

    // Also detect new user messages entering DOM → reset cache
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        const isHuman = (
          node.matches?.('[data-testid="human-turn-content"]') ||
          node.matches?.('.human-turn') ||
          node.querySelector?.('[data-testid="human-turn-content"]')
        );
        if (isHuman) {
          window.ClaudeBridgeClient.state.lastMessageTs = Date.now();
        }
      }
    }
  });

  observer.observe(document.body || document.documentElement, {
    childList : true,
    subtree   : true,
  });

  // ── 6. Listen for hash/history navigation ────────────────────

  window.addEventListener('popstate', () => {
    window.ClaudeUI.removeAll();
    injectAttempts = 0;
    setTimeout(tryInject, 1000);
  });

  // Original pushState interception for SPA routing
  const _origPushState = history.pushState.bind(history);
  history.pushState = function (...args) {
    _origPushState(...args);
    window.ClaudeUI.removeAll();
    injectAttempts = 0;
    setTimeout(tryInject, 1000);
  };

  // ── 7. Boot ──────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInject);
  } else {
    tryInject();
  }

})();
