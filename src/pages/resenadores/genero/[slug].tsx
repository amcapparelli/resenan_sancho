import React from 'react';
import { GetServerSideProps } from 'next';
import ReviewersPage from '../../../views/ReviewersPage';
import { PublicZoneLayout } from '../../../components/Layouts';
import { Seo } from '../../../components';
import { getReviewers, GetReviewersResult } from '../../../utils/seo/getReviewers';
import { isValidGenreSlug, isValidFormatSlug } from '../../../utils/seo/facets';
import { ListFacets } from '../../../utils/seo/listSeo';
import {
  computeReviewerListIndexing,
  buildReviewerListTitle,
  buildReviewerListDescription,
  buildReviewerGenrePath,
} from '../../../utils/seo/reviewerListSeo';

interface GenreLandingProps {
  facets: ListFacets;
  initialData: GetReviewersResult;
}

/** Reads a possibly-array route/query value as a single string (Next repeats keys). */
const firstValue = (value: string | string[] | undefined): string | undefined =>
  (Array.isArray(value) ? value[0] : value);

const GenreLanding: React.FC<GenreLandingProps> = ({ facets, initialData }): JSX.Element => {
  const { indexable } = computeReviewerListIndexing(facets, initialData.totalElements);

  // A fetch failure must never emit a cacheable `noindex` (it would drop an
  // indexable listing out of the index). On failure we keep the page's normal
  // robots policy and pair it with the 503/no-store set in getServerSideProps.
  const isFailure = !initialData.ok;
  const robotsNoindex = !isFailure && !indexable;

  return (
    <>
      <Seo
        title={buildReviewerListTitle(facets)}
        description={buildReviewerListDescription(facets)}
        // Self-canonical: the canonical always points at this same normalized
        // landing path (incl. any format/page) so faceted variants don't fold
        // into a different URL. Genre-only + results → indexable; genre+format
        // or empty → noindex,follow (decided by computeReviewerListIndexing:
        // any `format` present ⇒ not indexable).
        path={buildReviewerGenrePath(facets)}
        noindex={robotsNoindex}
        follow={robotsNoindex}
      />
      <PublicZoneLayout>
        {/*
          Key on the full facet signature (genre, format, page). Every applied
          filter/page change on this landing route is a real navigation that
          re-runs SSR on the same [slug] route WITHOUT unmounting the view. The
          changing key forces a remount, which reseeds the list reducer from the
          fresh SSR initialData and resets the mount-skip guard — so the new
          results render immediately with no client double-fetch, whether the
          user switched genre (fantasia → terror), added a format, or paged.
        */}
        <ReviewersPage
          key={`${facets.genre ?? 'all'}|${facets.format ?? ''}|${facets.page}`}
          initialFacets={facets}
          initialData={initialData}
        />
      </PublicZoneLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<GenreLandingProps> = async ({
  params,
  query,
  res,
}) => {
  const slug = firstValue(params?.slug);

  // Unknown genre slug → 404. We never serve a landing for a slug that isn't in
  // the approved map: it would be a thin, uncrawlable dead-end.
  if (!slug || !isValidGenreSlug(slug)) return { notFound: true };

  const formatSlug = firstValue(query.format);
  // A format is optional here, but if present it must be a known value —
  // otherwise the landing would 200 on garbage. 404 mirrors the /reviewers route.
  if (formatSlug && !isValidFormatSlug(formatSlug)) return { notFound: true };

  const format = formatSlug ?? null;
  const rawPage = firstValue(query.page);

  // Normalize page: only a positive integer > 1 survives in the URL. Any other
  // present `page` value (1, 0, negatives, non-numeric) 301-redirects to the
  // clean landing path (dropping `page`, KEEPING `format`) so a single URL owns
  // the first page and the canonical stays consistent with the address bar.
  const parsedPage = rawPage ? Number.parseInt(rawPage, 10) : 1;
  const page = Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1;

  if (rawPage !== undefined && page === 1) {
    const cleanPath = buildReviewerGenrePath({ genre: slug, format, page: 1 });
    return {
      redirect: {
        destination: cleanPath,
        permanent: true,
      },
    };
  }

  const initialData = await getReviewers({
    genre: slug,
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
        facets: { genre: slug, format, page },
        initialData,
      },
    };
  }

  // Short-lived caching: the listing changes as reviewers are added, but
  // crawlers and repeat visitors within a minute can safely share a response.
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  return {
    props: {
      facets: { genre: slug, format, page },
      initialData,
    },
  };
};

export default GenreLanding;
