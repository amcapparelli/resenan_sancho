import React from 'react';
import styled from 'styled-components';

/**
 * Placeholder shown in a cover slot when the book has no cover URL.
 *
 * Extracted from `BookCard` so the home's featured cards render the exact same
 * placeholder instead of a second copy of the icon + box. It fills its
 * positioned parent, which is the one that decides the slot size (BookCard uses
 * a 3/4 CoverArea, FeaturedBooks a smaller one).
 *
 * It is purely decorative — the title always sits next to it — so the wrapper is
 * aria-hidden and the icon carries no accessible name.
 */
const BookCoverFallback = (): JSX.Element => (
  <Fallback aria-hidden="true">
    <BookIcon />
  </Fallback>
);

const BookIcon: React.FC = () => (
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

const Fallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cream};
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.3;
`;

export default BookCoverFallback;
