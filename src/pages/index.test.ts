/**
 * Unit tests for the home ('/') SSR entry point. `getHomeHighlights` is mocked
 * at the module boundary; the genre-code → slug/name mappers run for real so the
 * assertions prove the SSR boundary translates the API's DB codes into
 * UI-facing display names/slugs (the components must never see a raw code).
 *
 * The deliberate divergence from the listings is exercised here: on a fetch
 * failure the home stays 200 (it degrades, dropping the accessory blocks) and
 * only marks the response no-store — it does NOT 503 like the listing routes.
 */
import { getServerSideProps } from './index';
import { getHomeHighlights, GetHomeHighlightsResult } from '../utils/seo/getHomeHighlights';
import { createMockContext } from '../test-utils/ssrContext';

jest.mock('../utils/seo/getHomeHighlights');

const mockedGetHomeHighlights = getHomeHighlights as jest.MockedFunction<
  typeof getHomeHighlights
>;

afterEach(() => {
  jest.resetAllMocks();
});

// Narrow the SSR result to its props branch: the home always returns props (it
// never redirects or 404s), so this keeps the assertions readable.
const propsOf = async (
  result: Awaited<ReturnType<typeof getServerSideProps>>,
): Promise<Record<string, unknown>> => {
  if (!('props' in result)) throw new Error('expected a props result');
  // Next types `props` as the value OR a Promise of it; await covers both.
  return (await result.props) as unknown as Record<string, unknown>;
};

describe('home getServerSideProps — happy path', () => {
  it('maps DB genre codes to display names/slugs and sets a long-lived cache header', async () => {
    const highlights: GetHomeHighlightsResult = {
      ok: true,
      featuredBooks: [
        {
          id: 'book-1',
          title: 'Un libro',
          author: 'Autora',
          genre: 'TER',
          copies: 3,
          cover: 'https://example.com/cover.jpg',
        },
      ],
      topGenres: [{ code: 'FAN', totalBooks: 11 }],
    };
    mockedGetHomeHighlights.mockResolvedValue(highlights);
    const context = createMockContext();

    const result = await getServerSideProps(context);
    const props = await propsOf(result);

    // Mapped, not raw: the genre code 'TER' becomes a display name, and the
    // top-genre code 'FAN' becomes a slug + name the tile can link to.
    expect(props.featuredBooks).toEqual([
      {
        id: 'book-1',
        title: 'Un libro',
        author: 'Autora',
        copies: 3,
        genreName: 'Terror',
        cover: 'https://example.com/cover.jpg',
      },
    ]);
    expect(props.topGenres).toEqual([
      { slug: 'fantasia', name: 'Fantasía', totalBooks: 11 },
    ]);
    expect(context.res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=3600',
    );
    expect(context.res.statusCode).toBe(200);
  });
});

describe('home getServerSideProps — fetch failure degrades, never 503', () => {
  it('sets no-store, keeps statusCode 200 and returns empty blocks', async () => {
    mockedGetHomeHighlights.mockResolvedValue({
      ok: false,
      featuredBooks: [],
      topGenres: [],
    });
    const context = createMockContext();

    const result = await getServerSideProps(context);
    const props = await propsOf(result);

    expect(context.res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
    // The home root must not signal whole-domain unavailability, so it stays 200.
    expect(context.res.statusCode).toBe(200);
    expect(props.featuredBooks).toEqual([]);
    expect(props.topGenres).toEqual([]);
  });
});
