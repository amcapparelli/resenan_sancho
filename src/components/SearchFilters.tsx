import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CHEVRON_SVG } from '../utils/selectChevron';
import ClearFiltersButton from './ClearFiltersButton';

// Visually hidden but accessible to screen readers
const VisuallyHidden = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const Bar = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.white};
  padding: 14px 28px;
  border-top: 0.5px solid ${({ theme }) => theme.lightBorder};
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};
  /* Always show shadow — detecting scroll position isn't possible in styled-components */
  box-shadow: 0 2px 12px rgba(61, 58, 53, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    padding: 12px 16px;
    gap: 8px;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;

  @media (max-width: 480px) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9a8c7e;
  width: 15px;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const TextInput = styled.input`
  background: ${({ theme }) => theme.white};
  border: 1.5px solid ${({ theme }) => theme.lightBorder};
  border-radius: 8px;
  padding: 9px 14px 9px 38px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.ink};
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.terracotta};
    outline: none;
    box-shadow: 0 0 0 2px rgba(199, 91, 34, 0.18);
  }

  &::placeholder {
    color: #9a8c7e;
  }
`;

const FilterSelect = styled.select`
  background: ${({ theme }) => theme.white};
  border: 1.5px solid ${({ theme }) => theme.lightBorder};
  border-radius: 8px;
  padding: 9px 36px 9px 14px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.ink};
  min-width: 160px;
  cursor: pointer;
  /* Remove native appearance so we can render our own chevron */
  appearance: none;
  -webkit-appearance: none;
  background-image: ${CHEVRON_SVG};
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;

  &:focus {
    border-color: ${({ theme }) => theme.terracotta};
    outline: none;
    box-shadow: 0 0 0 2px rgba(199, 91, 34, 0.18);
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const FilterButton = styled.button`
  background: ${({ theme }) => theme.terracotta};
  color: ${({ theme }) => theme.white};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 9px 22px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease;

  &:hover {
    background: #a84a1b;
  }

  &:active {
    background: #8f3f17;
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const SearchIcon: React.FC = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export interface SearchFiltersProps {
  genres: Array<{ name: string; code: string }>;
  formats: string[];
  selectedGenre: string;
  selectedFormat: string;
  onGenreChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onFilter: () => void;
  onClear: () => void;
  /**
   * Label identifying what's being filtered, used to build the
   * page-specific aria-labels ("Filtrar libros" vs "Filtrar reseñadores").
   */
  entityLabel: 'libros' | 'reseñadores';
  /**
   * Free-text search input, only used by ReviewersPage — BooksPage has no
   * text search. Grouped into a single object so text/onChange can't drift
   * apart at the type level (unlike two independent optional props).
   */
  search?: {
    text: string;
    onChange: (text: string) => void;
  };
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  genres,
  formats,
  selectedGenre,
  selectedFormat,
  onGenreChange,
  onFormatChange,
  onFilter,
  onClear,
  entityLabel,
  search,
}) => {
  const { t } = useTranslation();
  const genreFilterId = `${entityLabel}-genre-filter`;
  const formatFilterId = `${entityLabel}-format-filter`;
  const searchTextId = `${entityLabel}-search-text`;
  // No filter picked yet: clearing would be a no-op, so the action is disabled
  // rather than hidden — hiding/showing it would shift the other controls
  // around every time a filter is picked or cleared.
  const hasActiveFilter = Boolean(search?.text || selectedGenre || selectedFormat);

  return (
    <Bar role="search" aria-label="Filtros de búsqueda">
      {search !== undefined && (
        <SearchInputWrapper>
          <VisuallyHidden htmlFor={searchTextId}>
            Buscar por nombre o descripción
          </VisuallyHidden>
          <SearchIconWrapper aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              width="15"
              height="15"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </SearchIconWrapper>
          <TextInput
            id={searchTextId}
            type="text"
            value={search.text}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder="Buscar por nombre o descripción…"
          />
        </SearchInputWrapper>
      )}

      <VisuallyHidden htmlFor={genreFilterId}>Género literario</VisuallyHidden>
      <FilterSelect
        id={genreFilterId}
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
      >
        <option value="">Todos los géneros</option>
        {genres.map((genre) => (
          <option key={genre.code} value={genre.code}>
            {t(`genres.${genre.name}`)}
          </option>
        ))}
      </FilterSelect>

      <VisuallyHidden htmlFor={formatFilterId}>Formato del libro</VisuallyHidden>
      <FilterSelect
        id={formatFilterId}
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value)}
      >
        <option value="">Todos los formatos</option>
        {formats.map((format) => (
          <option key={format} value={format}>
            {format}
          </option>
        ))}
      </FilterSelect>

      <FilterButton
        type="button"
        onClick={onFilter}
        aria-label={`Filtrar ${entityLabel}`}
      >
        <SearchIcon />
        Filtrar
      </FilterButton>

      <ClearFiltersButton
        onClick={onClear}
        disabled={!hasActiveFilter}
        ariaLabel={`Limpiar filtros de ${entityLabel}`}
      />
    </Bar>
  );
};

export default SearchFilters;
