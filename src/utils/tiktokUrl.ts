/**
 * Validates and normalizes the URL a reviewer pastes into the "TikTok" channel
 * field — see `docs/new-review-channels-spec.md`. Only the host is checked:
 * profile URLs (`/@user`) and share links (`vm.tiktok.com/...`) are both fine.
 */

const TIKTOK_HOSTS = ['tiktok.com', 'www.tiktok.com', 'vm.tiktok.com'];

/** Prepends `https://` when the input has no http(s) protocol. People often
 * paste `tiktok.com/@user`; we accept it for validation here and save it with
 * the protocol via `normalizeTikTokUrl`, so the public chip link isn't relative. */
const withProtocol = (input: string): string => (/^https?:\/\//i.test(input) ? input : `https://${input}`);

export function isTikTokUrl(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  let url: URL;
  try {
    url = new URL(withProtocol(trimmed));
  } catch {
    return false;
  }

  // `URL` already lowercases the hostname; exact match rejects lookalikes such
  // as `tiktok.com.fake.io` or `nottiktok.com`.
  return TIKTOK_HOSTS.includes(url.hostname);
}

/** Trimmed, absolute form of the URL to save. Unlike Amazon's normalizer it
 * keeps the path and query as typed: any TikTok path is a valid link. */
export function normalizeTikTokUrl(input: string): string {
  return withProtocol(input.trim());
}
