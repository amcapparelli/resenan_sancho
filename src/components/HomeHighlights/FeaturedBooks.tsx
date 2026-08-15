import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import formatAvailableCopies from '../../utils/formatAvailableCopies';
import SectionHeading, { HeadingAccent } from './SectionHeading';

/**
 * Card view-model. The highlights endpoint returns no cover and no synopsis, so
 * this block cannot reuse `BookCard`/`BookListItem` (both need the full `Book`).
 * The genre arrives already translated from its DB code in getServerSideProps.
 */
export interface FeaturedBook {
  id: string;
  title: string;
  /** Null when the author account was deleted; the byline is then omitted. */
  author: string | null;
  /**
   * Undefined when the DB genre code is not in the facets table: only the tag
   * is dropped, the card still links to a perfectly valid book.
   */
  genreName?: string;
  copies: number;
}

interface FeaturedBooksProps {
  books: FeaturedBook[];
}

const FeaturedBooks = ({ books }: FeaturedBooksProps): JSX.Element | null => {
  // With nothing to show (API failure or an empty list) the whole block is
  // dropped: there is no empty-state copy for it on the home, and the rest of
  // the page must keep rendering.
  if (books.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="SI RESEÑAS LIBROS"
        subtitle="Los cuatro libros con más ejemplares disponibles. Pide el tuyo y el autor te lo envía."
      >
        Libros <HeadingAccent>gratis</HeadingAccent> para reseñar
      </SectionHeading>

      <CardGrid>
        {books.map((book) => (
          <CardItem key={book.id}>
            {/* styled(Link) renders a single <a>: the card IS the link, so it
                carries no inner button (that would nest anchors). Its accessible
                name is built from the content in visual order, with no
                aria-label overriding it — that would hide the genre and the
                copies from screen readers and break WCAG 2.5.3 (Label in Name)
                against the visible text. */}
            <Card href={`/books/${book.id}`}>
              {book.genreName && <CardGenre>{book.genreName}</CardGenre>}
              <CardTitle>{book.title}</CardTitle>
              {book.author && <CardAuthor>por {book.author}</CardAuthor>}
              <CardCopies>{formatAvailableCopies(book.copies)}</CardCopies>
            </Card>
          </CardItem>
        ))}
      </CardGrid>

      <BlockLink href="/books">
        {/* The arrow is decoration: hidden so it is not read out as "flecha". */}
        Ver todos los libros para reseñar <span aria-hidden="true">→</span>
      </BlockLink>
    </Section>
  );
};

const Section = styled.section`
  background-color: ${({ theme }) => theme.cream};
  padding: 40px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 480px) {
    padding: 56px 28px;
  }
`;

const CardGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-width: 1040px;
  margin: 0 auto;
  padding: 0;
  list-style: none;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CardItem = styled.li`
  display: flex;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 1px 4px rgba(61, 58, 53, 0.07);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(61, 58, 53, 0.14);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.terracotta};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

const CardGenre = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  /* theme.muted only reaches ~3.3:1 on white, below the 4.5:1 AA asks at 11px. */
  color: ${({ theme }) => theme.brown};
  margin: 0;
`;

const CardTitle = styled.h3`
  font-family: 'Fraunces', serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: ${({ theme }) => theme.ink};
  margin: 0;
  /* Titles run up to ~76 chars in production. Clamping in CSS keeps the full
     title in the DOM — overflow: hidden only hides it visually, so crawlers and
     assistive tech still get it — unlike truncating the string in JS. */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardAuthor = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardCopies = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.successDark};
  margin: auto 0 0;
  padding-top: 6px;
`;

const BlockLink = styled(Link)`
  display: block;
  width: fit-content;
  margin: 24px auto 0;
  /* Only CTA of the block on mobile: the padding takes the tap target from the
     ~20px of the bare text line to the ~44px touch targets should have. */
  padding: 10px 12px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.terracotta};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.terracotta};
    outline-offset: 3px;
  }
`;

export default FeaturedBooks;
