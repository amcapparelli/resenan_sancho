import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import PageHeader from '../../components/PageHeader';
import { GENRE_FACETS, getGenreDisplayName } from '../../utils/seo/facets';

/**
 * Hub listing every public genre landing (/libros/genero/<slug>). It is fully
 * static — the genre list is a build-time constant — so it needs no data
 * fetching and has no loading/error/empty state to handle.
 */

interface GenreLink {
  slug: string;
  name: string;
}

/**
 * Sorted ONCE at module load (the list is a constant, so this is not per-render
 * work and needs no memo) and by the VISIBLE label, not by the canonical order
 * of GENRE_FACETS: that array is ordered by internal DB code, which would show
 * "novela negra" (code CRI) between "ciencia ficción" and "erótica" — close
 * enough to alphabetical to read as a bug. The canonical order is left intact.
 */
const GENRE_LINKS: GenreLink[] = GENRE_FACETS
  // getGenreDisplayName only returns undefined for unknown slugs, and these come
  // from GENRE_FACETS itself; the fallback just keeps the type honest.
  .map(({ slug }) => ({ slug, name: getGenreDisplayName(slug) ?? slug }))
  .sort((a, b) => a.name.localeCompare(b.name, 'es'));

const GenreIndexPage: React.FC = () => (
  <Wrapper>
    <PageHeader
      eyebrow="TODOS LOS GÉNEROS"
      titleBefore="Libros para reseñar,"
      titleAccent="género a género."
      subtitle="Elige un género y ve directo a los libros que buscan reseña."
    />

    <Content>
      <GenreGrid>
        {GENRE_LINKS.map(({ slug, name }) => (
          <li key={slug}>
            {/* Name only: no per-genre book count is available on this page (it
                fetches nothing), and repeating "Libros de …" on 17 rows would
                push the only distinguishing word to the right of every line. */}
            <GenreChip href={`/libros/genero/${slug}`}>{name}</GenreChip>
          </li>
        ))}
      </GenreGrid>

      {/* Exit route for anyone landing here from search: the page should not be
          a dead end for a visitor with no genre in mind. */}
      <Closing>
        ¿Aún no sabes por dónde empezar?{' '}
        <ClosingLink href="/books">
          {/* The arrow is decoration: hidden so it is not read out as "flecha". */}
          Ver todos los libros para reseñar <span aria-hidden="true">→</span>
        </ClosingLink>
      </Closing>
    </Content>
  </Wrapper>
);

const Wrapper = styled.div`
  background: ${({ theme }) => theme.white};
  min-height: 100vh;
`;

const Content = styled.div`
  max-width: 780px;
  margin: 0 auto;
  padding: 28px 20px 48px;
`;

const GenreGrid = styled.ul`
  display: grid;
  /* Chip-sized tracks: the labels are short, so auto-fit packs 2 columns on a
     360px screen and up to 4 on desktop without leaving holes in the last row. */
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const GenreChip = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* Tall enough to be a comfortable touch target on its own. */
  min-height: 48px;
  padding: 12px 14px;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 999px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
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

const Closing = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.brown};
  text-align: center;
  margin: 32px 0 0;
`;

const ClosingLink = styled(Link)`
  font-weight: 600;
  /* Same rule as the home's BlockLink: terracotta at 15px is 4.24:1 on white,
     under AA. Brown (8.03:1) at rest, terracotta on hover/focus (3:1 threshold). */
  color: ${({ theme }) => theme.brown};
  text-decoration: none;
  /* Inline-block padding keeps the tap target closer to 44px without breaking
     the sentence it lives in. */
  display: inline-block;
  padding: 6px 0;

  &:hover {
    color: ${({ theme }) => theme.terracotta};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.terracotta};
    outline-offset: 3px;
  }
`;

export default GenreIndexPage;
