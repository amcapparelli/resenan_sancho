/**
 * Host allow-list guard for `next/image`.
 *
 * `next/image` throws at runtime when a src host is not listed in
 * `images.remotePatterns` (next.config.js). All covers/avatars are uploaded to
 * Cloudinary today, but legacy/seed data might carry an unexpected host. This
 * guard lets callers optimise Cloudinary URLs while falling back gracefully
 * (unoptimized `next/image`) for anything else, so an unknown host can never
 * crash a public page.
 *
 * Keep the allow-list in sync with `images.remotePatterns` in next.config.js.
 */
export const OPTIMIZED_IMAGE_HOSTS = ['res.cloudinary.com'];

/**
 * Returns true when the URL points to a host configured for Next image
 * optimization. Relative/invalid/empty URLs return false so callers treat them
 * as "not optimizable" and use the safe fallback path.
 */
export function isOptimizedImageHost(url: string): boolean {
  if (!url) return false;

  try {
    const { hostname } = new URL(url);
    return OPTIMIZED_IMAGE_HOSTS.includes(hostname);
  } catch {
    // Not an absolute URL (or malformed) — cannot be an allow-listed remote host.
    return false;
  }
}
