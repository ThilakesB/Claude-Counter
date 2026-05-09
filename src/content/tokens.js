// ============================================================
// tokens.js — DOM scraping + token counting for Claude Counter
// ============================================================

window.ClaudeTokens = (function () {
  'use strict';

  const C = window.ClaudeCounterConstants;

  /**
   * Collect all message text visible in the current conversation.
   * Claude renders messages in containers with [data-testid*="message"]
   * or inside .font-claude-message / human-turn wrappers.
   */
  function scrapeConversationText() {
    const selectors = [
      // Human turns
      '[data-testid="human-turn-content"]',
      '.human-turn',
      // Assistant turns
      '[data-testid="ai-response"]',
      '.font-claude-message',
      // Generic fallback
      '[class*="message-content"]',
      '[class*="MessageContent"]',
      '[class*="turn-"]',
      'article',
    ];

    const seen = new Set();
    let allText = '';

    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        const text = el.innerText || el.textContent || '';
        if (text.trim().length > 10) {
          allText += text + '\n';
        }
      });
    }

    // Deduplicate lines (some selectors may overlap)
    const lines = allText.split('\n');
    const unique = [...new Set(lines)];
    return unique.join('\n');
  }

  /**
   * Count approximate tokens for the entire visible conversation.
   * Returns { count: number, percent: number, color: string }
   */
  function countCurrentTokens() {
    const text = scrapeConversationText();
    const count = window.O200kTokenizer
      ? window.O200kTokenizer.countTokens(text)
      : Math.round(text.length / 4); // bare-bones fallback

    const percent = count / C.MAX_TOKENS;

    let color = C.COLOR_BLUE;
    if (percent >= C.TOKEN_DANGER_THRESHOLD)   color = C.COLOR_RED;
    else if (percent >= C.TOKEN_WARNING_THRESHOLD) color = C.COLOR_YELLOW;

    return { count, percent: Math.min(percent, 1), color };
  }

  return { scrapeConversationText, countCurrentTokens };
})();
