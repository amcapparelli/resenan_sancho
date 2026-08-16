import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

import formatAvailableCopies from '../../utils/formatAvailableCopies';
import { isOptimizedImageHost } from '../../utils/imageHost';
import BookCoverFallback from '../BookCoverFallback';
import SectionHeading, { HeadingAccent } from './SectionHeading';
import BlockLink from './BlockLink';

/**
 * Card view-model. The highlights endpoint returns no synopsis and no formats,
 * so this block cannot reuse `BookCard`/`BookListItem` (both need the full
 * `Book`). The genre arrives already translated from its DB code in
 * getServerSideProps.
 */
export interface FeaturedBook {
  id: string;
  title: string;
  /**
   * Absolute cover URL. Omitted for books uploaded before covers existed; the
   * card then renders the shared placeholder.
   */
  cover?: string;
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
        {/* The accent falls on "disponibles" because it is the only new piece of
            information in the sentence ("Libros… para reseñar" repeats all over
            the site) and, at 360px, the line breaks right after it. */}
        Libros <HeadingAccent>disponibles</HeadingAccent> para reseñar
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
              <CoverArea>
                {book.cover ? (
                  <CoverImage
                    src={book.cover}
                    /* Decorative on purpose, unlike BookCard's "Portada de X":
                       here the cover lives INSIDE the same <a> as the title, so
                       a described alt would make the link announce the title
                       twice ("Portada de X, X, por Autor…"). */
                    alt=""
                    fill
                    /* Cover box across this block's own grid: a fixed thumbnail
                       on mobile (row layout), then 2 and 4 columns of a 1040px
                       container minus paddings. */
                    sizes="(min-width: 1040px) 220px, (min-width: 900px) 22vw, (min-width: 480px) 45vw, 76px"
                    /* An unexpected host in legacy data would make next/image
                       throw and take the home down; unoptimized renders it as-is. */
                    unoptimized={!isOptimizedImageHost(book.cover)}
                  />
                ) : (
                  <BookCoverFallback />
                )}
              </CoverArea>

              <CardBody>
                {book.genreName && <CardGenre>{book.genreName}</CardGenre>}
                <CardTitle>{book.title}</CardTitle>
                {book.author && <CardAuthor>por {book.author}</CardAuthor>}
                <CardCopies>{formatAvailableCopies(book.copies)}</CardCopies>
              </CardBody>
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

/**
 * White background: the home alternates cream/white section by section, and the
 * new "Qué es Reseñan Sancho" block right above this one is cream. The cards
 * take the cream fill this section used to have so they keep standing out
 * against the section behind them.
 */
const Section = styled.section`
  background-color: ${({ theme }) => theme.white};
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

/**
 * Cover beside the text on mobile (a full-width poster per card would turn the
 * stacked block into four screens of scrolling) and above it from 480px up,
 * where the grid gets narrow columns.
 */
const Card = styled(Link)`
  display: flex;
  flex-direction: row;
  gap: 12px;
  width: 100%;
  padding: 16px;
  background: ${({ theme }) => theme.cream};
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

  @media (min-width: 480px) {
    flex-direction: column;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

/**
 * Reserves the cover box with a fixed 3/4 aspect-ratio, so the frame's height
 * never depends on the auto-height card and the image can't be stretched:
 * `object-fit: cover` crops instead, which matters because real covers range
 * from near-square to very tall. With next/image `fill` the image is
 * position:absolute and contributes no layout, so this box is what prevents CLS.
 * `align-self` stops the row layout from stretching the box to the card height.
 */
const CoverArea = styled.div`
  position: relative;
  flex: none;
  align-self: flex-start;
  width: 76px;
  aspect-ratio: 3 / 4;
  border-radius: 8px;
  overflow: hidden;
  /* Sits under the placeholder (which is translucent) so an empty slot still
     reads as a frame against the cream card. */
  background: ${({ theme }) => theme.white};

  @media (min-width: 480px) {
    align-self: stretch;
    width: 100%;
  }
`;

const CoverImage = styled(Image)`
  object-fit: cover;
  object-position: center top;
`;

/** Text column. `flex: 1` + `min-width: 0` keeps the ellipsis on long bylines. */
const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const CardGenre = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  /* theme.muted only reaches ~2.8:1 on the cream card, far below the 4.5:1 AA
     asks at 11px; theme.brown is at ~7.1:1. */
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
  /* successDark keeps 4.6:1 on the cream card; the lighter "success" green
     would drop to ~3.1:1, under AA for this 13px line. */
  color: ${({ theme }) => theme.successDark};
  margin: auto 0 0;
  padding-top: 6px;
`;

export default FeaturedBooks;
