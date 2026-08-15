import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import TopGenres, { TopGenre } from './TopGenres';

const GENRES: TopGenre[] = [
  { slug: 'fantasia', name: 'Fantasía', totalBooks: 11 },
  { slug: 'novela-historica', name: 'Novela histórica', totalBooks: 1 },
];

const renderBlock = (genres: TopGenre[] = GENRES) => render(
  <ThemeProvider theme={StyledTheme}>
    <TopGenres genres={genres} />
  </ThemeProvider>,
);

describe('TopGenres', () => {
  it('renders the section heading as an h2', () => {
    renderBlock();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Empieza por tu género favorito' }),
    ).toBeInTheDocument();
  });

  it('renders the capitalized genre name and its book count', () => {
    renderBlock();

    expect(screen.getByText('Fantasía')).toBeInTheDocument();
    expect(screen.getByText('11 libros para reseñar')).toBeInTheDocument();
    expect(screen.getByText('1 libro para reseñar')).toBeInTheDocument();
  });

  it('links each genre to its landing page', () => {
    renderBlock();

    expect(
      screen.getByRole('link', { name: /fantasía/i }),
    ).toHaveAttribute('href', '/libros/genero/fantasia');
    expect(
      screen.getByRole('link', { name: /novela histórica/i }),
    ).toHaveAttribute('href', '/libros/genero/novela-historica');
  });

  it('exposes both lines as the accessible name of a single anchor', () => {
    // REGRESSION (PR #67): the whole tile is one styled(Link), never a Link
    // wrapping another anchor.
    const { container } = renderBlock();

    expect(container.querySelectorAll('a')).toHaveLength(2);
    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });

  it('renders nothing when there are no genres', () => {
    const { container } = renderBlock([]);

    expect(container).toBeEmptyDOMElement();
  });
});
