// ============================================================
// bridge-client.js — Content-script side of the bridge.
// Listens for postMessage from bridge.js and updates state.
// ============================================================

window.ClaudeBridgeClient = (function () {
  'use strict';

  const C = window.ClaudeCounterConstants;
  const MSG_SOURCE = 'claude-counter-bridge';

  // ── Shared state (read by main.js tick loop) ─────────────────
  const state = {
    // message_limit from SSE
    sessionUsedFrac : 0,
    weeklyUsedFrac  : 0,
    sessionResetMs  : C.SESSION_DURATION_MS,
    weeklyResetMs   : C.WEEKLY_DURATION_MS,

    // Cache timer
    lastMessageTs   : 0,   // epoch ms when last message completed

    // Org ID (parsed from usage API URL or cookies)
    orgId           : null,
  };

  // ── Inject bridge.js into page context ──────────────────────

  function injectBridge() {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL('src/injected/bridge.js');
    s.onload = () => s.remove();
    (document.head || document.documentElement).appendChild(s);
  }

  // ── Parse message_limit from Claude SSE ─────────────────────
  // The field can be:
  //   { type: "message_limit", message_limit: { type: "within_limit", remaining: 4, ... } }
  // OR directly { remaining: N, resetsAt: "..." }

  function handleMessageLimit(data) {
    // data is the value of json.message_limit
    if (!data || typeof data !== 'object') return;

    // Extract remaining and total if present
    const remaining = data.remaining ?? data.remaining_tokens ?? null;
    const total     = data.total     ?? data.max_tokens       ?? null;

    if (remaining !== null && total !== null && total > 0) {
      state.sessionUsedFrac = Math.max(0, 1 - remaining / total);
    }

    // Parse reset time if available
    if (data.resetsAt || data.reset_at) {
      const resetDate = new Date(data.resetsAt || data.reset_at);
      state.sessionResetMs = Math.max(0, resetDate - Date.now());
    }
  }

  // ── Parse usage API response ─────────────────────────────────

  function handleUsageData(json, url) {
    if (!json || typeof json !== 'object') return;

    // Store org ID from URL if available
    const orgMatch = url.match(/organizations\/([a-zA-Z0-9_-]+)\//);
    if (orgMatch) state.orgId = orgMatch[1];

    // Top-level keys to check
    const session = json.session || json.current_session || json;
    const weekly  = json.weekly  || json.current_week    || json;

    // Session
    if (session.used !== undefined && session.limit !== undefined) {
      state.sessionUsedFrac = session.used / session.limit;
    } else if (session.usage_fraction !== undefined) {
      state.sessionUsedFrac = session.usage_fraction;
    }

    // Weekly
    if (weekly.weekly_used !== undefined && weekly.weekly_limit !== undefined) {
      state.weeklyUsedFrac = weekly.weekly_used / weekly.weekly_limit;
    } else if (weekly.weekly_fraction !== undefined) {
      state.weeklyUsedFrac = weekly.weekly_fraction;
    }

    // Reset times
    if (json.session_resets_at) {
      state.sessionResetMs = Math.max(0, new Date(json.session_resets_at) - Date.now());
    }
    if (json.weekly_resets_at) {
      state.weeklyResetMs = Math.max(0, new Date(json.weekly_resets_at) - Date.now());
    }
  }

  // ── Message listener ─────────────────────────────────────────

  window.addEventListener('message', (event) => {
    if (!event.data || event.data.source !== MSG_SOURCE) return;

    const { type, payload } = event.data;

    switch (type) {
      case 'bridge_ready':
        // Bridge is live — optionally fetch usage now
        fetchUsageIfPossible();
        break;

      case 'message_limit':
        handleMessageLimit(payload.data);
        break;

      case 'message_start':
      case 'message_stop':
        // Reset the cache timer on every assistant message event
        state.lastMessageTs = Date.now();
        break;

      case 'usage_data':
        handleUsageData(payload.json, payload.url);
        break;

      case 'sse_chunk': {
        const json = payload.json;
        if (json?.message_limit) handleMessageLimit(json.message_limit);
        if (json?.type === 'message_start' || json?.type === 'message_stop') {
          state.lastMessageTs = Date.now();
        }
        break;
      }

      case 'api_json':
        handleUsageData(payload.json, payload.url);
        break;
    }
  });

  // ── Proactively fetch /usage ─────────────────────────────────

  async function fetchUsageIfPossible() {
    try {
      // Try to get orgId from lastActiveOrg cookie (set by Claude)
      let orgId = state.orgId;
      if (!orgId) {
        // Attempt to read from document.cookie (may be HttpOnly)
        const match = document.cookie.match(/lastActiveOrg=([^;]+)/);
        if (match) orgId = decodeURIComponent(match[1]);
      }
      if (!orgId) return;

      const url = `/api/organizations/${orgId}/usage`;
      const resp = await fetch(url, { credentials: 'include' });
      if (resp.ok) {
        const json = await resp.json();
        handleUsageData(json, url);
      }
    } catch (_) {}
  }

  // ── Init ─────────────────────────────────────────────────────

  function init() {
    injectBridge();
  }

  return { init, state, fetchUsageIfPossible };
})();
