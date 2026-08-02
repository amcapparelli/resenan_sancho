/**
 * Serializes JSON-LD for inline injection via dangerouslySetInnerHTML.
 *
 * JSON.stringify escapes quotes and newlines but NOT the literal "</script>"
 * sequence, so user-provided fields (e.g. a book synopsis) could close the
 * inline <script> tag early and open an XSS hole. Escaping every "<" as its
 * unicode form neutralizes the breakout while keeping the JSON valid.
 */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');
