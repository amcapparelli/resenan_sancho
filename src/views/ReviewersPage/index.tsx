import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useReviewersListFetch from '../../utils/customHooks/useReviewersListFetch';
import useFilters from '../../utils/customHooks/useFilters';
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
  const [filters, setFilterValue] = useFilters({ page: 1 });
  const [state, listRequest, loading] = useReviewersListFetch();
  const [searchText, setSearchText] = useState('');

  // Fetch on mount and whenever the page changes; genre/format/search changes
  // are applied only when the user presses "Filtrar" (see handleFilter).
  useEffect(() => {
    listRequest(filters);
  }, [filters.page]);

  const handleFilter = () => {
    listRequest({ ...filters, page: 1, searchText: searchText });
  };

  const handlePageChange = (page: number) => {
    setFilterValue('page', page);
  };

  const isEmpty = !loading && state.reviewers.length === 0;

  return (
    <Wrapper>
      <PageHeader
        eyebrow="RESEÑADORES LITERARIOS"
        titleBefore="Encuentra a tu próximo"
        titleAccent="lector."
        subtitle="Booktubers, bookstagrammers y blogueros literarios listos para reseñar tu libro."
      />
      <SearchFilters
        genres={genresList}
        formats={FORMATS}
        searchText={searchText}
        selectedGenre={filters.genre ?? ''}
        selectedFormat={filters.format ?? ''}
        onSearchTextChange={setSearchText}
        onGenreChange={(value) => setFilterValue('genre', value)}
        onFormatChange={(value) => setFilterValue('format', value)}
        onFilter={handleFilter}
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
          currentPage={Number(filters.page) || 1}
          totalPages={state.totalPages}
          onChange={handlePageChange}
        />
      )}
    </Wrapper>
  );
};

export default ReviewersPage;
