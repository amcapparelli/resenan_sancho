/**
 * Regression tests for BookCard.
 *
 * Bug fixed: the "Pedir ejemplar gratuito" CTA used the legacy Next 9 pattern
 * `<Link passHref><styled.a />`, which caused Link to wrap its own <a> around
 * the child <a> — invalid HTML in Next 15.
 * Fix: CTAButton is now `styled(Link)` rendered directly, producing a single
 * <a> element pointing to `/books/<id>` with no nesting.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import BookCard from './BookCard';
import { Book } from '../../interfaces/books';

// react-i18next: return the last segment of the key as a plain string so genre
// badges render predictably without loading real translation files.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('.').pop() ?? key,
  }),
}));

// ─── Fixture ─────────────────────────────────────────────────────────────────

const BOOK_FIXTURE: Book = {
  _id: 'book-123',
  title: 'El Quijote',
  author: { name: 'Miguel', lastName: 'de Cervantes' },
  synopsis: 'Un hidalgo manchego que enloquece leyendo libros de caballerías.',
  genre: 'ADV',
  formats: ['papel', 'epub'],
  cover: '',
  editorial: 'Autor independiente',
  pages: 320,
  copies: 5,
  freePromoAvailable: false,
};

// ─── Helper ──────────────────────────────────────────────────────────────────

function renderCard(book: Book = BOOK_FIXTURE) {
  return render(
    <ThemeProvider theme={StyledTheme}>
      <BookCard book={book} />
    </ThemeProvider>,
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

describe('BookCard — content', () => {
  it('renders the book title', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: /el quijote/i })).toBeInTheDocument();
  });

  it('renders the author name', () => {
    renderCard();
    expect(screen.getByText(/miguel/i)).toBeInTheDocument();
    expect(screen.getByText(/de cervantes/i)).toBeInTheDocument();
  });

  it('renders the synopsis', () => {
    renderCard();
    expect(screen.getByText(/hidalgo manchego/i)).toBeInTheDocument();
  });

  it('renders format chips', () => {
    renderCard();
    expect(screen.getByText('papel')).toBeInTheDocument();
    expect(screen.getByText('epub')).toBeInTheDocument();
  });

  it('renders the CTA link with its aria-label', () => {
    renderCard();
    expect(
      screen.getByRole('link', { name: 'Pedir ejemplar de El Quijote' }),
    ).toBeInTheDocument();
  });

  it('renders the cover with an accessible alt when provided', () => {
    const book = { ...BOOK_FIXTURE, cover: 'https://example.com/cover.jpg' };
    renderCard(book);
    expect(screen.getByAltText('Portada de El Quijote')).toBeInTheDocument();
  });

  it('renders the placeholder when the book has no cover', () => {
    // The placeholder now comes from the shared BookCoverFallback: this keeps
    // /books covering that path after the extraction. It is decorative, so it
    // must contribute no image and no accessible name.
    const { container } = renderCard();

    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();
  });

  it('keeps the raw src for a non-optimizable host (unoptimized fallback)', () => {
    // Unknown host (not in images.remotePatterns): the host guard renders an
    // unoptimized next/image, so the original URL is served as-is rather than
    // routed through /_next/image (which would throw for that host).
    const book = { ...BOOK_FIXTURE, cover: 'https://example.com/cover.jpg' };
    renderCard(book);
    expect(screen.getByAltText('Portada de El Quijote')).toHaveAttribute(
      'src',
      'https://example.com/cover.jpg',
    );
  });

  it('serves a Cloudinary cover through the Next image optimizer', () => {
    // Allow-listed host: next/image rewrites src to /_next/image?url=… and the
    // encoded original still contains the cloudinary path.
    const book = {
      ...BOOK_FIXTURE,
      cover: 'https://res.cloudinary.com/dnhkw9n4n/image/upload/cover.jpg',
    };
    renderCard(book);
    const src = screen.getByAltText('Portada de El Quijote').getAttribute('src') ?? '';
    expect(src).toContain('/_next/image');
    expect(decodeURIComponent(src)).toContain('res.cloudinary.com');
  });
});

// ─── Nested-anchor regression (invalid-HTML bug) ─────────────────────────────
// Bug: CTAButton was styled.a wrapped in <Link passHref>, so Link rendered its
// own <a> around the child styled.a — producing invalid <a><a> nesting.
// Fix: CTAButton is styled(Link), which resolves to a single <a>.

describe('BookCard — nested-anchor regression', () => {
  it('does not nest an <a> inside another <a>', () => {
    // REGRESSION: before the fix, <Link passHref><CTAButton> produced
    // <a href="/books/book-123"><a aria-label="...">Pedir...</a></a>.
    const { container } = renderCard();

    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });

  it('renders the CTA as a single <a> element', () => {
    // REGRESSION: styled(Link) must produce exactly one anchor for the CTA.
    const { container } = renderCard();

    const allAnchors = container.querySelectorAll('a');
    expect(allAnchors).toHaveLength(1);
    expect(allAnchors[0].tagName).toBe('A');
  });

  it('CTA anchor href points to the book detail page', () => {
    // REGRESSION: the anchor must carry the correct /books/<id> href.
    renderCard();

    const ctaLink = screen.getByRole('link', { name: 'Pedir ejemplar de El Quijote' });
    expect(ctaLink).toHaveAttribute('href', '/books/book-123');
  });

  it('preserves the aria-label "Pedir ejemplar de <title>" on the CTA anchor', () => {
    // Accessibility: aria-label must survive the styled(Link) conversion.
    renderCard();

    expect(
      screen.getByRole('link', { name: 'Pedir ejemplar de El Quijote' }),
    ).toBeInTheDocument();
  });
});
