import { GetServerSideProps } from 'next';
import { SITE_URL } from '../utils/constants/seo';
import { getBooks } from '../utils/seo/getBooks';
import { genreCodeToSlug, FORMAT_FACETS } from '../utils/seo/facets';

// Public, indexable static routes. Private/auth routes are intentionally
// excluded (also blocked in robots.txt).
const STATIC_PATHS = ['/', '/about', '/books', '/reviewers', '/legal'];

// One wide pull is enough for the current catalogue size (~100s of books). If
// the API caps the page size below this, we page through totalPages defensively.
const SITEMAP_PAGE_SIZE = 1000;

// Hard cap on the pagination loop. If the API ignores `size` and paginates with
// a small page size, totalPages could be large and fire many sequential
// requests; this bounds the worst case so sitemap generation can't run away.
const MAX_SITEMAP_PAGES = 50;

interface DynamicUrls {
  bookIds: string[];
  genreSlugs: string[];
  formatValues: string[];
}

/**
 * Collects every public book id plus the set of genre/format facets that have
 * at least one result, in a single pass. Only NON-EMPTY facets are emitted so
 * the sitemap never advertises a landing URL that would render zero results
 * (those are noindex anyway).
 */
const collectDynamicUrls = async (): Promise<DynamicUrls> => {
  const first = await getBooks({ page: 1, size: SITEMAP_PAGE_SIZE });

  const books = [...first.books];
  // Fall back to pagination if the API ignored `size` and returned a partial
  // first page. totalPages reflects the API's own page size in that case, capped
  // at MAX_SITEMAP_PAGES so a tiny API page size can't trigger a runaway loop.
  const lastPage = Math.min(first.totalPages ?? 1, MAX_SITEMAP_PAGES);
  for (let page = 2; page <= lastPage; page += 1) {
    // Sequential on purpose: the sitemap is generated rarely and we prefer not
    // to hammer the API with parallel requests. eslint-disable for await-in-loop.
    // eslint-disable-next-line no-await-in-loop
    const next = await getBooks({ page, size: SITEMAP_PAGE_SIZE });
    books.push(...next.books);
  }

  const genreCodes = new Set<string>();
  const formatValues = new Set<string>();
  const bookIds: string[] = [];

  books.forEach((book) => {
    if (book._id) bookIds.push(book._id);
    if (book.genre) genreCodes.add(book.genre);
    // A book can offer several formats; every present one is a valid facet.
    (book.formats ?? []).forEach((format) => formatValues.add(format));
  });

  // Map genre codes → public slugs, dropping any code not in the approved map.
  const genreSlugs = Array.from(genreCodes)
    .map((code) => genreCodeToSlug(code))
    .filter((slug): slug is string => Boolean(slug));

  // Emit known format facets in canonical order, keeping only the ones with at
  // least one book. Mapping over FORMAT_FACETS already restricts to known values.
  const orderedFormats = FORMAT_FACETS
    .map((f) => f.value)
    .filter((value) => formatValues.has(value));

  return { bookIds, genreSlugs, formatValues: orderedFormats };
};

// Escape the five XML entities. Today every facet URL has a single param and
// slugs are [a-z-], so this is defensive: a future second param (introducing a
// literal `&`) or an unexpected character can't emit invalid XML.
const escapeXml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const toUrl = (path: string): string => {
  const loc = escapeXml(`${SITE_URL}${path === '/' ? '' : path}`);
  return `  <url><loc>${loc}</loc></url>`;
};

const buildSitemap = (dynamic: DynamicUrls): string => {
  const staticUrls = STATIC_PATHS.map(toUrl);
  const bookUrls = dynamic.bookIds.map((id) => toUrl(`/books/${id}`));
  // Page-1 facet URLs only, no `page` param (matches the canonical listing URL).
  const genreUrls = dynamic.genreSlugs.map((slug) => toUrl(`/books?genre=${slug}`));
  const formatUrls = dynamic.formatValues.map((value) => toUrl(`/books?format=${value}`));

  const urls = [...staticUrls, ...bookUrls, ...genreUrls, ...formatUrls].join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
};

// Standard Next.js Pages Router pattern: the page renders nothing; the XML is
// streamed from getServerSideProps so it is served with the right content type.
const SitemapXml = (): null => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Defensive: if the book fetch fails, still emit the static routes rather than
  // 500 the sitemap. getBooks never throws (it returns ok:false with empty
  // books), so this catch only guards unexpected throws in the
  // collection/serialisation. first.books stays [] on failure, so pagination and
  // the facet collection degrade to just the static routes.
  let dynamic: DynamicUrls = { bookIds: [], genreSlugs: [], formatValues: [] };
  try {
    dynamic = await collectDynamicUrls();
  } catch {
    dynamic = { bookIds: [], genreSlugs: [], formatValues: [] };
  }

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(buildSitemap(dynamic));
  res.end();

  return { props: {} };
};

export default SitemapXml;
