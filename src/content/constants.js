// ============================================================
// constants.js — All limits and configuration for Claude Counter
// ============================================================

window.ClaudeCounterConstants = {
  // Token limits
  MAX_TOKENS: 200_000,            // o200k_base context window
  TOKEN_WARNING_THRESHOLD: 0.75,  // 75% — yellow warning
  TOKEN_DANGER_THRESHOLD: 0.90,   // 90% — red danger

  // Cache timer (Claude caches for 5 minutes per message)
  CACHE_DURATION_MS: 5 * 60 * 1000,  // 5 minutes in ms

  // Session & weekly reset windows (approximate)
  SESSION_DURATION_MS: 5 * 60 * 60 * 1000,   // 5 hours
  WEEKLY_DURATION_MS:  7 * 24 * 60 * 60 * 1000, // 7 days

  // UI update interval
  TICK_INTERVAL_MS: 1000,

  // Selectors to find claude.ai input box containers
  INPUT_SELECTORS: [
    '[data-testid="chat-input"]',
    'div[contenteditable="true"]',
    '.ProseMirror',
    'textarea[placeholder]',
    'fieldset',
    'form[data-testid]'
  ],

  // Claude API paths
  API_USAGE_PATH: '/api/organizations/{orgId}/usage',

  // Colors
  COLOR_BG:        '#1a1a1a',
  COLOR_TEXT:      '#e8e8e8',
  COLOR_MUTED:     '#888',
  COLOR_BLUE:      '#4a90d9',
  COLOR_GREEN:     '#4caf50',
  COLOR_YELLOW:    '#f5a623',
  COLOR_RED:       '#e74c3c',
  COLOR_BORDER:    '#2e2e2e',
  COLOR_PROGRESS:  '#4a90d9',
};
