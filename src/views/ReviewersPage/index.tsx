import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  useReviewersListFetch,
  useListFilters,
  useScrollToTopOnPageChange,
} from '../../utils/customHooks';
import genresList from '../../utils/constants/genres';
import formatsList from '../../utils/constants/formats';
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

// ─── Component ─────────────────────────────────────────────────────────────

const ReviewersPage: React.FC = () => {
  const {
    draftFilters,
    setDraftFilter,
    appliedFilters,
    applyFilters,
    goToPage,
  } = useListFilters();
  const [state, listRequest, loading] = useReviewersListFetch();
  const currentPage = appliedFilters.page;
  const resultsSectionRef = useScrollToTopOnPageChange<HTMLDivElement>(currentPage);

  // The applied filters are the only trigger for a request: pressing "Filtrar"
  // or changing page produces a new object here and this effect fetches once.
  // `listRequest` is intentionally out of the deps — the hook returns a new
  // function on every render, so including it would fetch in a loop.
  useEffect(() => {
    listRequest({ ...appliedFilters.values, page: appliedFilters.page });
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
