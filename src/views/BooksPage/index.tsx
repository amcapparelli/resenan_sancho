import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  useBooksListFetch,
  useListFilters,
  useScrollToTopOnPageChange,
} from '../../utils/customHooks';
import genresList from '../../utils/constants/genres';
import formatsList from '../../utils/constants/formats';
import { genreSlugToCode, genreCodeToSlug } from '../../utils/seo/facets';
import { ListFacets } from '../../utils/seo/listSeo';
import { GetBooksResult } from '../../utils/seo/getBooks';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import SearchFilters from './SearchFilters';
import ResultsMeta from '../../components/ResultsMeta';
import BookCard from './BookCard';
import BookCardSkeleton from './BookCardSkeleton';
import Pagination from './Pagination';

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

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

// ─── Empty state icon ──────────────────────────────────────────────────────

const EmptyBookIcon: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

// ─── Available formats as plain strings ───────────────────────────────────

// formatsList is an array of enum values (strings), so we can use it directly
const FORMATS: string[] = formatsList as unknown as string[];

// ─── SSR seeding helpers ─────────────────────────────────────────────────────

/**
 * Turns URL facets (public slugs) into the draft/applied filter values the
 * filter selects expect. The genre select is keyed by the internal DB CODE
 * (see SearchFilters), so the slug is mapped back to its code here; the format
 * value is already the DB value. Empty keys are dropped so buildQueryString and
 * the "no filter" API semantics keep working.
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
 * Reverse of facetsToFilterValues for the URL: internal filter values (genre
 * CODE, format value) → the query params that make up the public, indexable
 * URL (genre SLUG, format value). Param order is fixed (genre, format, page) so
 * the shallow-routed URL matches the server's canonical ordering.
 */
const buildListQuery = (
  values: Record<string, string>,
  page: number,
): Record<string, string> => {
  const query: Record<string, string> = {};
  const genreSlug = values.genre ? genreCodeToSlug(values.genre) : undefined;
  if (genreSlug) query.genre = genreSlug;
  if (values.format) query.format = values.format;
  if (page > 1) query.page = String(page);
  return query;
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface BooksPageProps {
  /** URL-derived facets from SSR. Absent when rendered without server props. */
  initialFacets?: ListFacets;
  /** Server-fetched first page so the initial paint shows real data. */
  initialData?: GetBooksResult;
}

// ─── Component ─────────────────────────────────────────────────────────────

const BooksPage: React.FC<BooksPageProps> = ({ initialFacets, initialData }) => {
  const router = useRouter();
  const hasSsrData = Boolean(initialData);

  const {
    draftFilters,
    setDraftFilter,
    appliedFilters,
    applyFilters,
    goToPage,
  } = useListFilters(facetsToFilterValues(initialFacets));

  const [state, listRequest, loading] = useBooksListFetch(initialData);
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
      if (hasSsrData) return;
    }

    listRequest({ ...appliedFilters.values, page: appliedFilters.page });

    // Reflect the applied filters in the URL (public slugs, deterministic order)
    // without re-running getServerSideProps. Shallow keeps the SSR data path for
    // real navigations/crawlers while the SPA handles in-page filtering.
    const listQuery = buildListQuery(appliedFilters.values, appliedFilters.page);
    router.push({ pathname: '/books', query: listQuery }, undefined, {
      shallow: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  const isEmpty = !loading && state.books.length === 0;

  return (
    <Wrapper>
      <PageHeader
        eyebrow="LIBROS EN BÚSQUEDA DE RESEÑAS"
        titleBefore="Encuentra tu próxima"
        titleAccent="lectura."
        subtitle="Pide el ejemplar que te interese. El autor recibe tu mensaje y te lo envía."
      />
      <ResultsSection ref={resultsSectionRef}>
        <SearchFilters
          genres={genresList}
          formats={FORMATS}
          selectedGenre={draftFilters.genre ?? ''}
          selectedFormat={draftFilters.format ?? ''}
          onGenreChange={(value) => setDraftFilter('genre', value)}
          onFormatChange={(value) => setDraftFilter('format', value)}
          onFilter={applyFilters}
        />

        <ResultsMeta total={state.totalElements ?? 0} label="libros disponibles" />

        <Grid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              // Index is stable here — the skeleton count never reorders
              // eslint-disable-next-line react/no-array-index-key
              <BookCardSkeleton key={i} />
            ))
            : state.books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
        </Grid>

        {isEmpty && (
          <EmptyState
            subtitle="Prueba con otros filtros o explora todos los libros."
            icon={<EmptyBookIcon />}
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

export default BooksPage;
