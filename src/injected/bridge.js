// ============================================================
// bridge.js — Injected into PAGE context to intercept fetch/XHR
// Communicates back to the content script via postMessage.
// ============================================================

(function () {
  'use strict';

  const MSG_SOURCE = 'claude-counter-bridge';

  function post(type, payload) {
    window.postMessage({ source: MSG_SOURCE, type, payload }, '*');
  }

  // ── Intercept fetch ──────────────────────────────────────────

  const _origFetch = window.fetch;

  window.fetch = async function (...args) {
    const response = await _origFetch.apply(this, args);

    try {
      const url = typeof args[0] === 'string'
        ? args[0]
        : args[0] instanceof Request ? args[0].url : String(args[0]);

      // Only intercept Claude's own API calls
      if (!url.includes('claude.ai') && !url.startsWith('/')) {
        return response;
      }

      // Clone so we can read the body without consuming it
      const clone = response.clone();

      // ── SSE stream (completion endpoint) ─────────────────────
      if (url.includes('/api/') && (
        url.includes('completion') ||
        url.includes('chat') ||
        url.includes('messages')
      )) {
        const contentType = clone.headers.get('content-type') || '';

        if (contentType.includes('text/event-stream')) {
          // Read SSE in the background
          readSSEStream(clone, url);
        } else {
          // Regular JSON response
          clone.json().then(json => {
            post('api_json', { url, json });
          }).catch(() => {});
        }
      }

      // ── Usage endpoint ────────────────────────────────────────
      if (url.includes('/usage') || url.includes('/stats')) {
        clone.json().then(json => {
          post('usage_data', { url, json });
        }).catch(() => {});
      }

    } catch (e) {
      // Silently ignore bridge errors — never break Claude
    }

    return response;
  };

  async function readSSEStream(response, url) {
    try {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete last line

        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const raw = line.slice(5).trim();
          if (!raw || raw === '[DONE]') continue;

          try {
            const json = JSON.parse(raw);
            post('sse_chunk', { url, json });

            // Detect message_limit field
            if (json.message_limit !== undefined) {
              post('message_limit', { url, data: json.message_limit });
            }
            // Usage delta
            if (json.usage !== undefined) {
              post('usage_delta', { url, data: json.usage });
            }
            // Detect new message event (start of assistant turn)
            if (json.type === 'message_start') {
              post('message_start', { url, data: json });
            }
            if (json.type === 'message_stop') {
              post('message_stop', { url, data: json });
            }
          } catch (_) {}
        }
      }
    } catch (e) {}
  }

  // ── Intercept XHR (fallback) ─────────────────────────────────

  const _XHROpen  = XMLHttpRequest.prototype.open;
  const _XHRSend  = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._ccUrl = url;
    return _XHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', function () {
      try {
        const url = this._ccUrl || '';
        if (!url.includes('claude.ai') && !url.startsWith('/')) return;

        if (url.includes('/usage') || url.includes('/stats')) {
          const json = JSON.parse(this.responseText);
          post('usage_data', { url, json });
        }
      } catch (_) {}
    });
    return _XHRSend.apply(this, args);
  };

  // Signal ready
  post('bridge_ready', {});

})();
