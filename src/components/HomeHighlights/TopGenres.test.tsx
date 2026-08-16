import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import TopGenres, { TopGenre } from './TopGenres';

// The facets table is stubbed with THREE genres so the expected copy ("3") can
// never coincide with the real 17. Asserting `GENRE_FACETS.length` against the
// real table would pass just as well with a hardcoded "17" in the component,
// which is exactly the regression this test exists to catch.
jest.mock('../../utils/seo/facets', () => ({
  ...jest.requireActual('../../utils/seo/facets'),
  GENRE_FACETS: [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }],
}));

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
      screen.getByRole('heading', { level: 2, name: 'Géneros más populares' }),
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

    // One anchor per tile, plus the block link to the genre hub.
    expect(container.querySelectorAll('a')).toHaveLength(GENRES.length + 1);
    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });

  it('links to the genre hub with the count derived from the facets table', () => {
    // The count must never be hardcoded in the copy: adding a genre to
    // GENRE_FACETS has to update this CTA on its own. With the table stubbed at
    // three entries, a hardcoded number would fail here.
    renderBlock();

    const hubLink = screen.getByRole('link', { name: 'Explora los 3 géneros' });

    expect(hubLink).toHaveAttribute('href', '/libros/genero');
    // The arrow is rendered but aria-hidden, so it stays out of the name above.
    expect(hubLink).toHaveTextContent('Explora los 3 géneros →');
  });

  it('renders nothing when there are no genres', () => {
    const { container } = renderBlock([]);

    expect(container).toBeEmptyDOMElement();
  });
});
