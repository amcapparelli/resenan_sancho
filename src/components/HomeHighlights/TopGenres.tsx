import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import formatBookCount from '../../utils/formatBookCount';
import { GENRE_FACETS } from '../../utils/seo/facets';
import SectionHeading, { HeadingAccent } from './SectionHeading';
import BlockLink from './BlockLink';

/** Tile view-model: name and slug are resolved from the DB code in SSR. */
export interface TopGenre {
  /** Public URL slug, e.g. "novela-historica". */
  slug: string;
  /** Display name, already capitalized, e.g. "Novela histórica". */
  name: string;
  totalBooks: number;
}

interface TopGenresProps {
  genres: TopGenre[];
}

const TopGenres = ({ genres }: TopGenresProps): JSX.Element | null => {
  // Same rule as FeaturedBooks: no data, no block (no empty-state copy here).
  if (genres.length === 0) return null;

  return (
    <Section>
      <SectionHeading>
        Géneros más <HeadingAccent>populares</HeadingAccent>
      </SectionHeading>

      <GenreGrid>
        {genres.map((genre) => (
          <GenreItem key={genre.slug}>
            {/* Both lines live inside the same styled(Link) → one <a>, whose
                accessible name is "<Género> N libros para reseñar". */}
            <GenreTile href={`/libros/genero/${genre.slug}`}>
              <GenreName>{genre.name}</GenreName>
              <GenreCount>{formatBookCount(genre.totalBooks)}</GenreCount>
            </GenreTile>
          </GenreItem>
        ))}
      </GenreGrid>

      <BlockLink href="/libros/genero">
        {/* The count comes from GENRE_FACETS so the copy can't go stale when a
            genre is added. Deliberately a different verb + object than the
            "Ver todos los libros…" CTA of the block above: two consecutive
            links starting with the same words read as the same destination.
            The arrow is decoration, hidden so it is not read out as "flecha". */}
        Explora los {GENRE_FACETS.length} géneros <span aria-hidden="true">→</span>
      </BlockLink>
    </Section>
  );
};

/**
 * Cream background: it closes the home's cream/white alternation, with
 * FeaturedBooks (white) right above. The tiles take white so they still read as
 * cards against the section.
 */
const Section = styled.section`
  background-color: ${({ theme }) => theme.cream};
  padding: 40px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 480px) {
    padding: 56px 28px;
  }
`;

const GenreGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  max-width: 780px;
  margin: 0 auto;
  padding: 0;
  list-style: none;

  /* auto-fit instead of a fixed 3-column track: at 480px three tiles would be
     ~138px wide and wrap "11 libros para reseñar" onto several lines. It also
     absorbs a list of 2 or 4 genres without leaving holes in the row. */
  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
`;

const GenreItem = styled.li`
  display: flex;
`;

const GenreTile = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 18px 16px;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s ease, transform 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.terracottaSoft};
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

const GenreName = styled.span`
  font-family: 'Fraunces', serif;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
`;

const GenreCount = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
`;

export default TopGenres;
