import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useBooksListFetch, useFilters } from '../../utils/customHooks';
import genresList from '../../utils/constants/genres';
import formatsList from '../../utils/constants/formats';
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

// ─── Component ─────────────────────────────────────────────────────────────

const BooksPage: React.FC = () => {
  // useFilters returns [filters, setFilterValue, loadFilters]
  const [filters, setFilterValue] = useFilters({ page: 1 });
  const [state, listRequest, loading] = useBooksListFetch();

  // Fetch whenever the page number changes; genre/format changes are
  // applied only when the user presses "Filtrar" (see handleFilter below).
  useEffect(() => {
    listRequest(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page]);

  const handleFilter = () => {
    // Reset to page 1 and fire the request with current filters
    listRequest({ ...filters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilterValue('page', page);
  };

  const isEmpty = !loading && state.books.length === 0;

  return (
    <Wrapper>
      <PageHeader
        eyebrow="LIBROS EN BÚSQUEDA DE RESEÑAS"
        titleBefore="Encuentra tu próxima"
        titleAccent="lectura."
        subtitle="Pide el ejemplar que te interese. El autor recibe tu mensaje y te lo envía."
      />
      <SearchFilters
        genres={genresList}
        formats={FORMATS}
        selectedGenre={filters.genre ?? ''}
        selectedFormat={filters.format ?? ''}
        onGenreChange={(value) => setFilterValue('genre', value)}
        onFormatChange={(value) => setFilterValue('format', value)}
        onFilter={handleFilter}
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
          currentPage={Number(filters.page) || 1}
          totalPages={state.totalPages}
          onChange={handlePageChange}
        />
      )}
    </Wrapper>
  );
};

export default BooksPage;
