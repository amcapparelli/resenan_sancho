import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import { GENRE_FACETS, getGenreDisplayName } from '../../utils/seo/facets';
import GenreIndexPage from './index';

const renderPage = () => render(
  <ThemeProvider theme={StyledTheme}>
    <GenreIndexPage />
  </ThemeProvider>,
);

/** The genre chips live in the only list of the page. */
const getGenreLinks = () => within(screen.getByRole('list')).getAllByRole('link');

describe('GenreIndexPage', () => {
  it('renders the page title as the only h1', () => {
    renderPage();

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Libros para reseñar, género a género.' }),
    ).toBeInTheDocument();
  });

  it('links every genre in the facets table to its landing page', () => {
    renderPage();

    expect(getGenreLinks()).toHaveLength(GENRE_FACETS.length);

    GENRE_FACETS.forEach(({ slug }) => {
      expect(
        screen.getByRole('link', { name: getGenreDisplayName(slug) }),
      ).toHaveAttribute('href', `/libros/genero/${slug}`);
    });
  });

  it('lists the genres alphabetically by visible label, not by internal code', () => {
    // GENRE_FACETS is ordered by DB code, which would put "Novela negra" (CRI)
    // third — right between "Ciencia ficción" and "Erótica".
    renderPage();

    const labels = getGenreLinks().map((link) => link.textContent);
    const alphabetical = [...labels].sort((a, b) => (a ?? '').localeCompare(b ?? '', 'es'));

    expect(labels).toEqual(alphabetical);
    expect(labels[0]).toBe('Aventura');
  });

  it('offers a way out to the full listing', () => {
    renderPage();

    const listingLink = screen.getByRole('link', { name: 'Ver todos los libros para reseñar' });

    expect(listingLink).toHaveAttribute('href', '/books');
    expect(screen.getByText(/¿Aún no sabes por dónde empezar\?/)).toBeInTheDocument();
  });
});
