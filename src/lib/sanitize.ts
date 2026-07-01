import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitize a string for safe HTML output (XSS prevention).
 * Uses DOMPurify with strict allowlist.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Sanitize a plain text string — strips ALL HTML tags.
 * Safe for any text that will be rendered in the DOM.
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}

/**
 * Sanitize input for safe storage (email, name, subject, message).
 * Removes HTML tags and normalizes whitespace.
 */
export function sanitizeInput(dirty: string): string {
  return sanitizeText(dirty).trim().replace(/\s+/g, ' ')
}