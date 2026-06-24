import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
} from '../utils/constants/seo';

interface SeoProps {
  // Pages pass the fully formatted title (it is rendered verbatim into <title>).
  title: string;
  description: string;
  // Path without origin, e.g. "/books". Combined with the active locale to build
  // the canonical and og:url.
  path: string;
  noindex?: boolean;
  ogImage?: string;
}

const buildAbsoluteUrl = (path: string, locale?: string, defaultLocale?: string): string => {
  // Non-default locales are served under a path prefix (e.g. /en/books). The
  // default locale (es) has no prefix.
  const localePrefix = locale && locale !== defaultLocale ? `/${locale}` : '';
  const normalizedPath = path === '/' ? '' : path;
  return `${SITE_URL}${localePrefix}${normalizedPath}`;
};

const Seo = ({
  title,
  description,
  path,
  noindex = false,
  ogImage = DEFAULT_OG_IMAGE,
}: SeoProps): JSX.Element => {
  const { locale, defaultLocale } = useRouter();

  const canonical = buildAbsoluteUrl(path, locale, defaultLocale);
  // Callers may pass an empty string (e.g. a book without a cover), which the
  // default param does not catch. Treat any falsy value as absent so we never
  // emit the bare origin as the social image.
  const effectiveOgImage = ogImage || DEFAULT_OG_IMAGE;
  const absoluteOgImage = effectiveOgImage.startsWith('http')
    ? effectiveOgImage
    : `${SITE_URL}${effectiveOgImage}`;
  // Decision: the English locale is kept out of the index for now (no hreflang
  // strategy yet), so any /en page is forced to noindex regardless of the prop.
  const shouldNoindex = noindex || locale === 'en';
  const ogLocale = locale === 'en' ? 'en_US' : 'es_ES';

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {shouldNoindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </Head>
  );
};

export default Seo;
