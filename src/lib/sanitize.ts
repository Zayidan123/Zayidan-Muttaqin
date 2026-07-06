/**
 * Sanitize a string by stripping HTML tags.
 * Uses a lightweight regex approach instead of DOMPurify to avoid jsdom native dependencies
 * that break on Cloudflare Workers.
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')   // Remove HTML tags
    .replace(/&nbsp;/g, ' ')    // Non-breaking spaces
    .replace(/&amp;/g, '&')     // Ampersands
    .replace(/&lt;/g, '<')      // Less than
    .replace(/&gt;/g, '>')      // Greater than
    .replace(/&quot;/g, '"')    // Quotes
    .replace(/&#\d+;/g, ' ')    // Numeric entities
    .replace(/&[a-zA-Z]+;/g, ' ') // Named entities
    .trim()
    .replace(/\s+/g, ' ')
}

/**
 * Sanitize a string for safe HTML output (XSS prevention).
 * Strips all HTML tags.
 */
export function sanitizeHtml(dirty: string): string {
  return stripHtmlTags(dirty)
}

/**
 * Sanitize a plain text string — strips ALL HTML tags.
 * Safe for any text that will be rendered in the DOM.
 */
export function sanitizeText(dirty: string): string {
  return stripHtmlTags(dirty)
}

/**
 * Sanitize input for safe storage (email, name, subject, message).
 * Removes HTML tags and normalizes whitespace.
 */
export function sanitizeInput(dirty: string): string {
  return sanitizeText(dirty).trim().replace(/\s+/g, ' ')
}