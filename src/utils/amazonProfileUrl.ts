/**
 * Classifies and normalizes the Amazon URL a reviewer pastes into the
 * "Amazon" channel field. We only care about the public profile URL (the
 * one listing their reviews); product pages, private account pages and
 * shortened links are all common mistakes that need a specific message —
 * see `docs/amazon-profile-link-spec.md` for the full rationale.
 */

export type AmazonUrlKind = 'profile' | 'product' | 'account' | 'short' | 'other';

const SHORT_HOSTS = ['amzn.eu', 'amzn.to', 'a.co'];

// `www.`-stripped host must be exactly `amazon.<tld>`, where `<tld>` is one
// or more dot-separated letter segments (e.g. `es`, `com`, `com.mx`,
// `co.uk`), 2-6 chars each. This rejects lookalikes such as
// `amazon.es.fake.com` (an extra domain segment after the TLD).
const AMAZON_HOST_PATTERN = /^amazon\.[a-z]{2,6}(\.[a-z]{2,6})?$/i;

const PROFILE_PATH_PATTERN = /\/gp\/profile\/(amzn1\.account\.[A-Z0-9]+)/i;
const PRODUCT_PATH_PATTERN = /\/dp\/|\/gp\/product\/|\/product-reviews\//i;
const ACCOUNT_PATH_PREFIXES = ['/gp/css/', '/your-account', '/hz/', '/gp/your-account'];

/** Prepends `https://` when the input has no protocol, so `new URL` can parse it. */
const withProtocol = (input: string): string => (/^https?:\/\//i.test(input) ? input : `https://${input}`);

const stripWwwPrefix = (host: string): string => host.replace(/^www\./i, '');

export function classifyAmazonUrl(input: string): AmazonUrlKind {
  const trimmed = input.trim();
  if (!trimmed) return 'other';

  let url: URL;
  try {
    url = new URL(withProtocol(trimmed));
  } catch {
    return 'other';
  }

  const host = stripWwwPrefix(url.hostname.toLowerCase());

  if (SHORT_HOSTS.includes(host)) return 'short';
  if (!AMAZON_HOST_PATTERN.test(host)) return 'other';
  if (PROFILE_PATH_PATTERN.test(url.pathname)) return 'profile';
  if (PRODUCT_PATH_PATTERN.test(url.pathname)) return 'product';
  if (ACCOUNT_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return 'account';

  return 'other';
}

export function normalizeAmazonProfileUrl(input: string): string | null {
  const trimmed = input.trim();
  if (classifyAmazonUrl(trimmed) !== 'profile') return null;

  const url = new URL(withProtocol(trimmed));
  const host = stripWwwPrefix(url.hostname.toLowerCase());
  const [, accountId] = url.pathname.match(PROFILE_PATH_PATTERN) as RegExpMatchArray;

  return `https://www.${host}/gp/profile/${accountId}`;
}
