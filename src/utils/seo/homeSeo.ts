import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../constants/seo';

// Absolute logo URL for the Organization schema (relative paths aren't allowed).
const LOGO_URL = DEFAULT_OG_IMAGE.startsWith('http')
  ? DEFAULT_OG_IMAGE
  : `${SITE_URL}${DEFAULT_OG_IMAGE}`;

/**
 * schema.org/WebSite for the home page. No SearchAction: the site search is a
 * faceted listing, not a query-string sitelinks search box, so advertising one
 * would be misleading.
 */
export const buildWebsiteJsonLd = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  inLanguage: 'es-ES',
});

/** schema.org/Organization for the home page, reusing the brand logo. */
export const buildOrganizationJsonLd = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: LOGO_URL,
});
