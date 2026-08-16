import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import FeaturedBooks, { FeaturedBook } from './FeaturedBooks';

const COVER_URL = 'https://res.cloudinary.com/dnhkw9n4n/image/upload/v1776802384/book_covers/v3mvtydp1o64pcycs38w.jpg';

const BOOKS: FeaturedBook[] = [
  {
    id: '684cc507aa5f1100147f757c',
    title: 'Bastión, El Conocimiento Poderoso',
    author: 'Eric Marreros',
    genreName: 'Terror',
    copies: 22,
    cover: COVER_URL,
  },
  {
    id: '6534fd5e9208e90014391987',
    title: 'Astrid la Estrella del Norte',
    author: 'Juanjo Galvez Benavente',
    genreName: 'Novela histórica',
    copies: 1,
    cover: COVER_URL,
  },
];

const renderBlock = (books: FeaturedBook[] = BOOKS) => render(
  <ThemeProvider theme={StyledTheme}>
    <FeaturedBooks books={books} />
  </ThemeProvider>,
);

describe('FeaturedBooks — content', () => {
  it('renders the section heading as an h2', () => {
    // Full accessible name, not a substring: the accented <em> must not break
    // the heading into pieces, and a copy change has to fail here instead of
    // slipping through on a partial match. The string is duplicated on purpose
    // rather than imported from the component — a shared constant would move
    // with any typo and assert nothing.
    renderBlock();

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Algunos de los libros disponibles para reseñar',
      }),
    ).toBeInTheDocument();
  });

  it('renders the eyebrow and the subtitle of the section', () => {
    renderBlock();

    expect(screen.getByText('SI RESEÑAS LIBROS')).toBeInTheDocument();
    expect(
      screen.getByText('Pide el que te llame la atención y el autor te lo envía.'),
    ).toBeInTheDocument();
  });

  it('renders each book title as an h3 hanging from the section heading', () => {
    renderBlock();

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(
      screen.getByRole('heading', { level: 3, name: 'Bastión, El Conocimiento Poderoso' }),
    ).toBeInTheDocument();
  });

  it('renders the byline and the genre of each book', () => {
    renderBlock();

    expect(screen.getByText('por Eric Marreros')).toBeInTheDocument();
    expect(screen.getByText('Novela histórica')).toBeInTheDocument();
  });

  it('uses the singular copy for a single available copy', () => {
    renderBlock();

    expect(screen.getByText('22 ejemplares disponibles')).toBeInTheDocument();
    expect(screen.getByText('1 ejemplar disponible')).toBeInTheDocument();
  });

  it('omits the byline when the author account was deleted', () => {
    renderBlock([{ ...BOOKS[0], author: null }]);

    expect(screen.queryByText(/^por /)).not.toBeInTheDocument();
  });

  it('omits only the genre tag when the code is unknown, keeping the card', () => {
    renderBlock([{ ...BOOKS[0], genreName: undefined }]);

    expect(screen.queryByText('Terror')).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Bastión, El Conocimiento Poderoso' }),
    ).toBeInTheDocument();
    expect(screen.getByText('22 ejemplares disponibles')).toBeInTheDocument();
  });
});

describe('FeaturedBooks — cover', () => {
  it('renders the cover of each book', () => {
    const { container } = renderBlock();

    const covers = container.querySelectorAll('img');

    expect(covers).toHaveLength(2);
    // next/image rewrites the src through the optimizer, so assert on the
    // Cloudinary asset id rather than on the exact URL.
    expect(covers[0].getAttribute('src')).toContain('v3mvtydp1o64pcycs38w');
  });

  it('keeps the raw src for a non-optimizable host (unoptimized fallback)', () => {
    // Unknown host (not in images.remotePatterns): the host guard renders an
    // unoptimized next/image, so the original URL is served as-is rather than
    // routed through /_next/image, which would throw for that host and take the
    // home down. Same contract as BookCard.
    const { container } = renderBlock([{ ...BOOKS[0], cover: 'https://example.com/cover.jpg' }]);

    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('marks the cover as decorative', () => {
    // The title sits inside the same <a>: a descriptive alt would make the link
    // announce it twice. See the alt="" comment in the component.
    const { container } = renderBlock();

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('falls back to the placeholder and keeps the card when there is no cover', () => {
    const { container } = renderBlock([{ ...BOOKS[0], cover: undefined }]);

    expect(container.querySelectorAll('img')).toHaveLength(0);
    // The placeholder is the shared decorative book icon.
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Bastión, El Conocimiento Poderoso' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Bastión/ }),
    ).toHaveAttribute('href', '/books/684cc507aa5f1100147f757c');
  });
});

describe('FeaturedBooks — links', () => {
  it('points each card at the SSR book detail route', () => {
    renderBlock();

    expect(
      screen.getByRole('link', { name: /Bastión, El Conocimiento Poderoso/ }),
    ).toHaveAttribute('href', '/books/684cc507aa5f1100147f757c');
  });

  it('builds the accessible name from the card content, in visual order', () => {
    // No aria-label: the genre, the title, the byline and the copies must all
    // reach anyone browsing by links with a screen reader.
    renderBlock();

    expect(
      screen.getByRole('link', { name: /Bastión, El Conocimiento Poderoso/ }),
    ).toHaveAccessibleName('Terror Bastión, El Conocimiento Poderoso por Eric Marreros 22 ejemplares disponibles');
  });

  it('degrades the accessible name when there is no author', () => {
    renderBlock([{ ...BOOKS[0], author: null }]);

    expect(screen.getByRole('link', { name: /Bastión/ })).toHaveAccessibleName(
      'Terror Bastión, El Conocimiento Poderoso 22 ejemplares disponibles',
    );
  });

  it('degrades the accessible name when the genre is unknown', () => {
    renderBlock([{ ...BOOKS[0], genreName: undefined }]);

    expect(screen.getByRole('link', { name: /Bastión/ })).toHaveAccessibleName(
      'Bastión, El Conocimiento Poderoso por Eric Marreros 22 ejemplares disponibles',
    );
  });

  it('renders the block link to the full listing without verbalizing the arrow', () => {
    renderBlock();

    const blockLink = screen.getByRole('link', { name: 'Ver todos los libros para reseñar' });

    expect(blockLink).toHaveAttribute('href', '/books');
    expect(blockLink).toHaveTextContent('Ver todos los libros para reseñar →');
  });

  it('never nests an anchor inside another anchor', () => {
    // REGRESSION (PR #67): the card is a styled(Link) with no inner CTA, so a
    // `<Link passHref><a>` style nesting can never come back.
    const { container } = renderBlock();

    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });
});

describe('FeaturedBooks — empty', () => {
  it('renders nothing when there are no books', () => {
    // The home has no empty-state copy for this block: it simply disappears.
    const { container } = renderBlock([]);

    expect(container).toBeEmptyDOMElement();
  });
});
