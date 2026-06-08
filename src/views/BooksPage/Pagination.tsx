import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 20px 28px 40px;
`;

const baseButtonStyles = css`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.brown};
  background: transparent;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.cream};
    border-color: ${({ theme }) => theme.lightBorder};
  }

  &:disabled {
    color: #c2b49e;
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const PageButton = styled.button<{ $active?: boolean }>`
  ${baseButtonStyles}

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.terracotta};
      color: ${theme.white};
      border-color: transparent;

      &:hover {
        background: ${theme.terracotta};
        border-color: transparent;
      }
    `}
`;

const Ellipsis = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.brown};
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 40px;
  }
`;

/**
 * Builds the list of page entries to display.
 * On small viewports (handled via CSS), we show a max of 5 numbers
 * centered around the current page, with ellipsis when needed.
 * On desktop we show all pages (the spec only constrains mobile).
 */
function buildPageItems(
  currentPage: number,
  totalPages: number,
): Array<number | 'ellipsis-start' | 'ellipsis-end'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const items: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [];
  const WINDOW = 2; // pages shown on each side of current

  const showStartEllipsis = currentPage - WINDOW > 2;
  const showEndEllipsis = currentPage + WINDOW < totalPages - 1;

  items.push(1);

  if (showStartEllipsis) {
    items.push('ellipsis-start');
  } else {
    for (let i = 2; i < currentPage - WINDOW; i++) {
      items.push(i);
    }
  }

  for (
    let i = Math.max(2, currentPage - WINDOW);
    i <= Math.min(totalPages - 1, currentPage + WINDOW);
    i++
  ) {
    items.push(i);
  }

  if (showEndEllipsis) {
    items.push('ellipsis-end');
  } else {
    for (let i = currentPage + WINDOW + 1; i < totalPages; i++) {
      items.push(i);
    }
  }

  items.push(totalPages);

  return items;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
}) => {
  const pageItems = useMemo(
    () => buildPageItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  if (totalPages <= 1) return null;

  return (
    <Nav aria-label="Paginación">
      <PageButton
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ←
      </PageButton>

      {pageItems.map((item) => {
        if (item === 'ellipsis-start' || item === 'ellipsis-end') {
          return <Ellipsis key={item}>…</Ellipsis>;
        }

        const page = item as number;
        const isActive = page === currentPage;

        return (
          <PageButton
            key={page}
            $active={isActive}
            onClick={() => !isActive && onChange(page)}
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Página ${page}`}
          >
            {page}
          </PageButton>
        );
      })}

      <PageButton
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
      >
        →
      </PageButton>
    </Nav>
  );
};

export default Pagination;
