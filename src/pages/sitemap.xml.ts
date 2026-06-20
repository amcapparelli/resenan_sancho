import { GetServerSideProps } from 'next';
import { SITE_URL } from '../utils/constants/seo';

// Public, indexable static routes only. Private/auth routes are intentionally
// excluded (also blocked in robots.txt).
// TODO: add dynamic book/reviewer URLs once listings are server-rendered (phase S4)
const STATIC_PATHS = ['/', '/about', '/books', '/reviewers', '/legal'];

const buildSitemap = (): string => {
  const urls = STATIC_PATHS.map(
    (path) => `  <url><loc>${SITE_URL}${path === '/' ? '' : path}</loc></url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

// Standard Next.js Pages Router pattern: the page renders nothing; the XML is
// streamed from getServerSideProps so it is served with the right content type.
const SitemapXml = (): null => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml');
  res.write(buildSitemap());
  res.end();

  return { props: {} };
};

export default SitemapXml;
