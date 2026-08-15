import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  useReviewersListFetch,
  useListFilters,
  useScrollToTopOnPageChange,
} from '../../utils/customHooks';
import genresList from '../../utils/constants/genres';
import formatsList from '../../utils/constants/formats';
import { genreSlugToCode, genreCodeToSlug } from '../../utils/seo/facets';
import { ListFacets } from '../../utils/seo/listSeo';
import { GetReviewersResult } from '../../utils/seo/getReviewers';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import SearchFilters from './SearchFilters';
import ResultsMeta from '../../components/ResultsMeta';
import ReviewerCard from './ReviewerCard';
import ReviewerCardSkeleton from './ReviewerCardSkeleton';
import Pagination from '../BooksPage/Pagination';

// ─── Styled ────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  background: ${({ theme }) => theme.white};
  min-height: 100vh;
`;

/**
 * Scroll anchor for pagination. It starts at the filter bar so a page change
 * lands with the filters at the top of the viewport and the results right
 * below, leaving the hero scrolled away above.
 *
 * The ref can't go on SearchFilters itself: its bar is `position: sticky`, so
 * once the user has scrolled past the hero it is already pinned at the top of
 * the viewport and scrollIntoView would be a no-op. This wrapper is a plain
 * block, so its box still reports the filters' natural position.
 */
const ResultsSection = styled.div`
  /* Breathing room above the filters when scrolled into view on page change */
  scroll-margin-top: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: 20px;
  padding: 0 28px 36px;

  @media (min-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// ─── Empty state icon ──────────────────────────────────────────────────────

const EmptyPersonIcon: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

// ─── formatsList as plain strings ─────────────────────────────────────────

// formatsList contains enum values (strings), so this cast is safe
const FORMATS: string[] = formatsList as unknown as string[];

// ─── SSR seeding helpers ─────────────────────────────────────────────────────

/**
 * Turns URL facets (public slugs) into the draft/applied filter values the
 * filter selects expect. The genre select is keyed by the internal DB CODE
 * (see SearchFilters), so the slug is mapped back to its code here; the format
 * value is already the DB value. `searchText` is intentionally absent: it's a
 * client-only filter that never appears in the URL/SSR, so it always starts
 * empty on a fresh (server-rendered) load.
 */
const facetsToFilterValues = (facets?: ListFacets): Record<string, string> => {
  if (!facets) return {};
  const values: Record<string, string> = {};
  const genreCode = facets.genre ? genreSlugToCode(facets.genre) : undefined;
  if (genreCode) values.genre = genreCode;
  if (facets.format) values.format = facets.format;
  return values;
};

/**
 * Reverse of facetsToFilterValues for the URL, phase S6b path-aware.
 *
 * Genre is a PATH facet (`/resenadores/genero/<slug>`), format/page stay in the
 * query. This maps the internal filter values (genre CODE, format value) to a
 * Next router target and resolves the target's public genre slug so the caller
 * can decide shallow-vs-navigate by comparing genre "surfaces":
 *  - With a genre → pathname `/resenadores/genero/[slug]` (Next fills [slug]
 *    from the query key) and `genreSlug` is the resolved public slug.
 *  - Without a genre → pathname `/reviewers` with format/page in the query,
 *    exactly as before, and `genreSlug` is null.
 *
 * The caller uses `genreSlug` to pick between two modes (see the effect below):
 *  - SAME genre surface as the current SSR page ⇒ shallow, client-side filtering.
 *    This is where ReviewersPage intentionally diverges from BooksPage: reviewers
 *    have a client-only `searchText` filter, so staying shallow lets a searchText
 *    change reach the client fetch WITHOUT re-running SSR (which would drop it).
 *  - DIFFERENT genre surface ⇒ real navigation, so the target route's SSR emits
 *    the right canonical/robots and `searchText` resets (Option A).
 *
 * Query key order is fixed (format, page) to mirror the server's canonical
 * ordering (buildReviewerGenrePath / buildReviewerListPath).
 *
 * `searchText` is deliberately excluded from the target query in BOTH branches:
 * it's a client-only filter and must never enter the URL/path (it would create
 * infinite non-indexable variants), even though it IS still sent in the
 * client-side fetch below.
 */
interface ReviewerListTarget {
  href: { pathname: string; query: Record<string, string> };
  /** Resolved public genre slug of the target, or null when there's no genre. */
  genreSlug: string | null;
}

const buildReviewerListTarget = (
  values: Record<string, string>,
  page: number,
): ReviewerListTarget => {
  const genreSlug = values.genre ? genreCodeToSlug(values.genre) : undefined;
  const query: Record<string, string> = {};
  if (values.format) query.format = values.format;
  if (page > 1) query.page = String(page);

  if (genreSlug) {
    // The [slug] dynamic segment is supplied via the query object; Next
    // interpolates it into the pathname and leaves the rest as the query string.
    return {
      href: {
        pathname: '/resenadores/genero/[slug]',
        query: { slug: genreSlug, ...query },
      },
      genreSlug,
    };
  }

  return { href: { pathname: '/reviewers', query }, genreSlug: null };
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface ReviewersPageProps {
  /** URL-derived facets from SSR. Absent when rendered without server props. */
  initialFacets?: ListFacets;
  /** Server-fetched first page so the initial paint shows real data. */
  initialData?: GetReviewersResult;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ReviewersPage: React.FC<ReviewersPageProps> = ({ initialFacets, initialData }) => {
  const router = useRouter();
  const hasSsrData = Boolean(initialData);

  // The genre surface this page was server-rendered on: the slug on a landing
  // route (e.g. 'biografia'), or null on /reviewers (where `?genre=` 301s to the
  // path, so SSR never renders a genre facet in the query). The effect compares
  // this against the target's genre slug to decide shallow-vs-navigate.
  const currentGenreSlug = initialFacets?.genre ?? null;

  const {
    draftFilters,
    setDraftFilter,
    appliedFilters,
    applyFilters,
    goToPage,
  } = useListFilters(facetsToFilterValues(initialFacets));
  const [state, listRequest, loading] = useReviewersListFetch(initialData);
  const currentPage = appliedFilters.page;
  const resultsSectionRef = useScrollToTopOnPageChange<HTMLDivElement>(currentPage);

  // Skip the client fetch that would otherwise duplicate the SSR fetch on first
  // paint. Only the mount run is skipped; every later `appliedFilters` change
  // (filter apply, pagination) still fetches. When there is no SSR data (e.g.
  // the standalone unit test), fetch on mount as before.
  const didMount = useRef(false);

  // The applied filters are the only trigger for a request: pressing "Filtrar"
  // or changing page produces a new object here and this effect fetches once.
  // `listRequest`/`router` are intentionally out of the deps — including a
  // value that changes every render would fetch in a loop.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      // With SSR data already in state, don't refetch the identical first page.
      // searchText always starts empty on a server-rendered load, so the SSR
      // result and the equivalent client fetch would be identical anyway.
      if (hasSsrData) return;
    }

    const target = buildReviewerListTarget(appliedFilters.values, appliedFilters.page);

    // Shallow when the target stays on the SAME genre surface as the current SSR
    // page (both null on /reviewers, or the same slug on a landing route). This
    // is the crux of the reviewers-only divergence from BooksPage: staying
    // shallow lets a client-only `searchText` change reach the client fetch
    // without re-running SSR (which never sees searchText and would drop it).
    //
    // A DIFFERENT genre surface — selecting a genre, switching between slugs, or
    // clearing the genre — is a real navigation so the destination route's
    // getServerSideProps emits the right canonical/robots and (via the route's
    // `key`) reseeds the list from fresh SSR data. searchText resets there by
    // design (client-only, never crosses the SSR boundary) — Option A.
    const isShallow = target.genreSlug === currentGenreSlug;

    if (!isShallow) {
      // Real navigation: SSR fetches and remounts this view with fresh
      // initialData, so we must NOT client-fetch here (that would duplicate the
      // SSR request). The mount-skip guard resets on remount and swallows the
      // would-be duplicate on the destination. searchText (client-only, never in
      // the URL) intentionally starts empty on the destination — Option A.
      router.push(target.href);
      return;
    }

    // The client fetch DOES include searchText (it filters results), but the
    // URL sync below does NOT — searchText stays out of the indexable surface.
    listRequest({ ...appliedFilters.values, page: appliedFilters.page });

    // Reflect the applied facets in the URL (public slugs, deterministic order)
    // without re-running getServerSideProps. Shallow keeps the SSR data path for
    // real navigations/crawlers while the SPA handles in-page filtering.
    router.push(target.href, undefined, { shallow: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  const isEmpty = !loading && state.reviewers.length === 0;

  return (
    <Wrapper>
      <PageHeader
        eyebrow="RESEÑADORES LITERARIOS"
        titleBefore="Encuentra a tu próximo"
        titleAccent="lector."
        subtitle="Booktubers, bookstagrammers y blogueros literarios listos para reseñar tu libro."
      />
      <ResultsSection ref={resultsSectionRef}>
        <SearchFilters
          genres={genresList}
          formats={FORMATS}
          searchText={draftFilters.searchText ?? ''}
          selectedGenre={draftFilters.genre ?? ''}
          selectedFormat={draftFilters.format ?? ''}
          onSearchTextChange={(value) => setDraftFilter('searchText', value)}
          onGenreChange={(value) => setDraftFilter('genre', value)}
          onFormatChange={(value) => setDraftFilter('format', value)}
          onFilter={applyFilters}
        />

        <ResultsMeta total={state.totalElements ?? 0} label="reseñadores encontrados" />

        <Grid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              // Index is stable here — the skeleton count never reorders
              // eslint-disable-next-line react/no-array-index-key
              <ReviewerCardSkeleton key={i} />
            ))
            : state.reviewers.map((reviewer) => (
              <ReviewerCard key={reviewer._id} reviewer={reviewer} />
            ))}
        </Grid>

        {isEmpty && (
          <EmptyState
            subtitle="Prueba con otros filtros o explora todos los reseñadores."
            icon={<EmptyPersonIcon />}
          />
        )}

        {!loading && state.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={state.totalPages}
            onChange={goToPage}
          />
        )}
      </ResultsSection>
    </Wrapper>
  );
};

export default ReviewersPage;
