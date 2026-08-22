/**
 * Unit tests for the /sitemap.xml SSR entry point. Both data helpers (`getBooks`
 * and `getReviewers`) are mocked at the module boundary so these tests cover the
 * URL collection, code→slug mapping and XML serialization without the network.
 * The facet helpers (`facets`) run for real, so the emitted <loc> URLs are
 * verified against the true slug mapping.
 */
import { getServerSideProps } from '../../pages/sitemap.xml';
import { getBooks, GetBooksResult } from '../../utils/seo/getBooks';
import { getReviewers, GetReviewersResult } from '../../utils/seo/getReviewers';
import { Book } from '../../interfaces/books';
import { SITE_URL } from '../../utils/constants/seo';
import { createMockContext } from '../../test-utils/ssrContext';

jest.mock('../../utils/seo/getBooks');
jest.mock('../../utils/seo/getReviewers');

const mockedGetBooks = getBooks as jest.MockedFunction<typeof getBooks>;
const mockedGetReviewers = getReviewers as jest.MockedFunction<typeof getReviewers>;

// Only the fields the sitemap reads (`_id`, `genre` code, `formats`) matter; the
// rest of the Book shape is irrelevant to URL collection.
const booksResult = (books: Array<Partial<Book>>): GetBooksResult => ({
  ok: true,
  books: books as Book[],
  totalElements: books.length,
  totalPages: 1,
});

// The sitemap reads only a reviewer's `genres` (long enum names).
const reviewersResult = (
  reviewers: Array<{ genres: string[] }>,
): GetReviewersResult => ({
  ok: true,
  reviewers: reviewers as unknown as GetReviewersResult['reviewers'],
  totalElements: reviewers.length,
  totalPages: 1,
});

const runSitemap = async (): Promise<{ xml: string; res: ReturnType<typeof createMockContext>['res'] }> => {
  const context = createMockContext();
  await getServerSideProps(context);
  const xml = context.res.write.mock.calls[0]?.[0] as string;
  return { xml, res: context.res };
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('sitemap.xml getServerSideProps — happy path', () => {
  beforeEach(() => {
    mockedGetBooks.mockResolvedValue(
      booksResult([
        { _id: 'book-1', genre: 'TER', formats: ['papel', 'epub'] },
        { _id: 'book-2', genre: 'FAN', formats: ['papel'] },
      ]),
    );
    mockedGetReviewers.mockResolvedValue(reviewersResult([{ genres: ['fantasy'] }]));
  });

  it('sets the XML content type and the sitemap cache header, then ends the response', async () => {
    const { res } = await runSitemap();

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/xml');
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400',
    );
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('emits the static routes', async () => {
    const { xml } = await runSitemap();

    // The root path is emitted without a trailing slash (path '/' → bare origin).
    expect(xml).toContain(`<loc>${SITE_URL}</loc>`);
    ['/about', '/books', '/libros/genero', '/reviewers', '/legal'].forEach((path) => {
      expect(xml).toContain(`<loc>${SITE_URL}${path}</loc>`);
    });
  });

  it('emits a /books/<id> URL per book', async () => {
    const { xml } = await runSitemap();

    expect(xml).toContain(`<loc>${SITE_URL}/books/book-1</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}/books/book-2</loc>`);
  });

  it('emits genre landing URLs from the mapped book genre codes', async () => {
    const { xml } = await runSitemap();

    expect(xml).toContain(`<loc>${SITE_URL}/libros/genero/terror</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}/libros/genero/fantasia</loc>`);
  });

  it('emits format facet URLs in canonical order for formats with books', async () => {
    const { xml } = await runSitemap();

    expect(xml).toContain(`<loc>${SITE_URL}/books?format=papel</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}/books?format=epub</loc>`);
    // Formats no book offers are never advertised.
    expect(xml).not.toContain('format=mobi');
    expect(xml).not.toContain('format=audiolibro');
  });

  it('emits reviewer genre landing URLs from the mapped reviewer genre names', async () => {
    const { xml } = await runSitemap();

    expect(xml).toContain(`<loc>${SITE_URL}/resenadores/genero/fantasia</loc>`);
  });
});

describe('sitemap.xml getServerSideProps — deduplicates book URLs', () => {
  it('emits each book URL only once even if the API returns a duplicate id across pages', async () => {
    // The sitemap pages through the API defensively (looping over totalPages).
    // With totalPages: 2 and the same book id returned on every page, the id
    // reaches URL collection twice; the sitemap must still emit its <loc> once.
    mockedGetBooks.mockResolvedValue({
      ok: true,
      books: [{ _id: 'book-dup' }] as Book[],
      totalElements: 1,
      totalPages: 2,
    });
    mockedGetReviewers.mockResolvedValue(reviewersResult([]));

    const { xml } = await runSitemap();

    const bookLoc = `<loc>${SITE_URL}/books/book-dup</loc>`;
    const occurrences = xml.split(bookLoc).length - 1;
    expect(occurrences).toBe(1);
  });
});

describe('sitemap.xml getServerSideProps — degrades when a helper throws', () => {
  it('still emits the static routes without crashing when getBooks rejects', async () => {
    mockedGetBooks.mockRejectedValue(new Error('API down'));
    mockedGetReviewers.mockResolvedValue(reviewersResult([]));

    const { xml, res } = await runSitemap();

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/xml');
    expect(res.end).toHaveBeenCalledTimes(1);
    expect(xml).toContain(`<loc>${SITE_URL}</loc>`);
    expect(xml).toContain(`<loc>${SITE_URL}/books</loc>`);
    // No dynamic URLs survive the failure.
    expect(xml).not.toContain('/books/');
    expect(xml).not.toContain('/libros/genero/');
  });
});
