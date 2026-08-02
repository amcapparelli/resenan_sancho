import React from 'react';
import { GetServerSideProps } from 'next';
import BooksPage from '../views/BooksPage';
import { PublicZoneLayout } from '../components/Layouts';
import { Seo } from '../components';
import { getBooks, GetBooksResult } from '../utils/seo/getBooks';
import { isValidGenreSlug, isValidFormatSlug } from '../utils/seo/facets';
import {
  ListFacets,
  computeListIndexing,
  buildListTitle,
  buildListDescription,
  buildListPath,
} from '../utils/seo/listSeo';

interface BooksRouteProps {
  facets: ListFacets;
  initialData: GetBooksResult;
}

/** Reads a possibly-array query value as a single string (Next repeats keys). */
const firstValue = (value: string | string[] | undefined): string | undefined =>
  (Array.isArray(value) ? value[0] : value);

const Books: React.FC<BooksRouteProps> = ({ facets, initialData }): JSX.Element => {
  const { indexable } = computeListIndexing(facets, initialData.totalElements);

  // A fetch failure must never emit a cacheable `noindex` (it would drop an
  // indexable listing out of the index). On failure we keep the page's normal
  // robots policy and pair it with the 503/no-store set in getServerSideProps.
  const isFailure = !initialData.ok;
  const robotsNoindex = !isFailure && !indexable;

  return (
    <>
      <Seo
        title={buildListTitle(facets)}
        description={buildListDescription(facets)}
        // Self-canonical: the canonical always points at this same normalized
        // URL (incl. any page param) so paginated/faceted variants don't fold
        // into the bare /books.
        path={buildListPath(facets)}
        noindex={robotsNoindex}
        follow={robotsNoindex}
      />
      <PublicZoneLayout>
        <BooksPage initialFacets={facets} initialData={initialData} />
      </PublicZoneLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<BooksRouteProps> = async ({
  query,
  res,
}) => {
  // Permanently redirect the legacy /books?book=<id> detail URL to the
  // dedicated server-rendered /books/<id> route (phase S3).
  if (query.book) {
    return {
      redirect: {
        destination: `/books/${firstValue(query.book)}`,
        permanent: true,
      },
    };
  }

  const genreSlug = firstValue(query.genre);
  const formatSlug = firstValue(query.format);
  const rawPage = firstValue(query.page);

  // Unknown facet slug → 404. We never serve a listing for a slug that isn't in
  // the approved map: it would be a thin, uncrawlable dead-end.
  if (genreSlug && !isValidGenreSlug(genreSlug)) return { notFound: true };
  if (formatSlug && !isValidFormatSlug(formatSlug)) return { notFound: true };

  const genre = genreSlug ?? null;
  const format = formatSlug ?? null;

  // Normalize page: only a positive integer > 1 survives in the URL. Any other
  // present `page` value (1, 0, negatives, non-numeric) 301-redirects to the
  // clean path so a single URL owns the first page and the canonical stays
  // consistent with the address bar.
  const parsedPage = rawPage ? Number.parseInt(rawPage, 10) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1;

  if (rawPage !== undefined && page === 1) {
    const cleanPath = buildListPath({ genre, format, page: 1 });
    return {
      redirect: {
        destination: cleanPath,
        permanent: true,
      },
    };
  }

  const initialData = await getBooks({
    genre: genre ?? undefined,
    format: format ?? undefined,
    page,
  });

  if (!initialData.ok) {
    // The API blipped (network/HTTP/parse error). Serve 503 so crawlers retry
    // later and, critically, DON'T cache this broken response — otherwise a
    // transient failure could get an indexable listing cached as noindex. The
    // page still renders its normal shell/empty UI with the 503.
    res.statusCode = 503;
    res.setHeader('Cache-Control', 'no-store');
    return {
      props: {
        facets: { genre, format, page },
        initialData,
      },
    };
  }

  // Short-lived caching: the listing changes as books are added, but crawlers
  // and repeat visitors within a minute can safely share a rendered response.
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return {
    props: {
      facets: { genre, format, page },
      initialData,
    },
  };
};

export default Books;
