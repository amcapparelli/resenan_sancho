import React from 'react';
import styled from 'styled-components';
import { TrashIcon } from './icons';

// Discreet reset action, not a navigation link: a <button>, not styled(Link),
// visually matching BookDetailPage's BreadcrumbLink (text + icon, no border/fill).
const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  padding: 9px 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.terracotta};
  }

  &:disabled {
    color: ${({ theme }) => theme.lightBorder};
    cursor: default;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

interface ClearFiltersButtonProps {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
}

/**
 * Shared "Limpiar filtros" action for BooksPage and ReviewersPage search bars.
 * The aria-label differs per page (books vs. reviewers), so it's the only
 * customizable part; the visible copy and icon are identical everywhere.
 */
const ClearFiltersButton: React.FC<ClearFiltersButtonProps> = ({
  onClick,
  disabled,
  ariaLabel,
}) => (
  <StyledButton type="button" onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
    <TrashIcon />
    Limpiar filtros
  </StyledButton>
);

export default ClearFiltersButton;
