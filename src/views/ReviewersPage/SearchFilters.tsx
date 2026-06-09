import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Chevron SVG encoded for use as CSS background-image (terracotta stroke)
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpolyline points='2%2C4 7%2C10 12%2C4' fill='none' stroke='%23C75B22' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%2F%3E%3C%2Fsvg%3E")`;

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

export interface ReviewerSearchFiltersProps {
  genres: Array<{ name: string; code: string }>;
  formats: string[];
  searchText: string;
  selectedGenre: string;
  selectedFormat: string;
  onSearchTextChange: (text: string) => void;
  onGenreChange: (value: string) => void;
  onFormatChange: (value: string) => void;
  onFilter: () => void;
}

const SearchFilters: React.FC<ReviewerSearchFiltersProps> = ({
  genres,
  formats,
  searchText,
  selectedGenre,
  selectedFormat,
  onSearchTextChange,
  onGenreChange,
  onFormatChange,
  onFilter,
}) => {
  const { t } = useTranslation();

  return (
    <Bar role="search" aria-label="Filtros de búsqueda">
      <SearchInputWrapper>
        <VisuallyHidden htmlFor="reviewer-search-text">
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
          id="reviewer-search-text"
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Buscar por nombre o descripción…"
        />
      </SearchInputWrapper>

      <VisuallyHidden htmlFor="reviewer-genre-filter">Género literario</VisuallyHidden>
      <FilterSelect
        id="reviewer-genre-filter"
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

      <VisuallyHidden htmlFor="reviewer-format-filter">Formato del libro</VisuallyHidden>
      <FilterSelect
        id="reviewer-format-filter"
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
        aria-label="Filtrar reseñadores"
      >
        <SearchIcon />
        Filtrar
      </FilterButton>
    </Bar>
  );
};

export default SearchFilters;
