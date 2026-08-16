// Canonical production origin. Used to build absolute canonical/OG URLs and the
// sitemap. Kept here so the value lives in a single place and never drifts.
export const SITE_URL = 'https://www.resenansancho.com';

// Dedicated 1200x630 social card served from public/. Kept as PNG on purpose:
// several crawlers/clients (WhatsApp, iMessage) do not render webp OG images.
export const DEFAULT_OG_IMAGE = '/og-image.png';

// Actual brand logo, used for the Organization JSON-LD `logo`. Kept distinct
// from DEFAULT_OG_IMAGE: the OG social card is a 1.9:1 text banner, whereas
// Google's Organization/logo expects a real logo image.
export const BRAND_LOGO = '/static/logo-web.webp';

export const SITE_NAME = 'Reseñan Sancho';
