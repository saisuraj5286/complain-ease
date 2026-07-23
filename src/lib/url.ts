/**
 * Returns the given string only if it is a safe http(s) URL, otherwise null.
 *
 * Guards against `javascript:`, `data:`, `vbscript:` and similar schemes that
 * are accepted by the WHATWG URL parser (and by Zod's `.url()`) but execute
 * script when placed in an anchor `href`. Use this before rendering any
 * user-supplied URL into an `href`/`src`.
 */
export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.href;
    }
  } catch {
    // not a parseable absolute URL
  }
  return null;
}
