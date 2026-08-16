import { SITE_URL, SITE_NAME, BRAND_LOGO } from '../constants/seo';

// Absolute brand-logo URL for the Organization schema (relative paths aren't
// allowed). Derived from BRAND_LOGO, not the OG social card.
const LOGO_URL = BRAND_LOGO.startsWith('http')
  ? BRAND_LOGO
  : `${SITE_URL}${BRAND_LOGO}`;

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
