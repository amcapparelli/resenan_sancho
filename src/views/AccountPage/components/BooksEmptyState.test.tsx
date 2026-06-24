/**
 * Regression tests for BooksEmptyState.
 *
 * Bug fixed: the "Añadir mi primer libro" CTA used the legacy Next 9 pattern
 * `<Link passHref><styled.a /></Link>`, which caused Link to render its own
 * wrapping <a> around the child <a> — invalid HTML in Next 15.
 * Fix: PrimaryButton is now `styled(Link)` rendered directly, producing a
 * single <a> element with no nesting.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../store/context/StylesContext/Theme';
import BooksEmptyState from './BooksEmptyState';

// ─── Helper ──────────────────────────────────────────────────────────────────

function renderEmptyState() {
  return render(
    <ThemeProvider theme={StyledTheme}>
      <BooksEmptyState />
    </ThemeProvider>,
  );
}

// ─── Content ─────────────────────────────────────────────────────────────────

describe('BooksEmptyState — content', () => {
  it('renders the empty-state headline', () => {
    renderEmptyState();
    expect(screen.getByText('Aún no has publicado ningún libro')).toBeInTheDocument();
  });

  it('renders the supporting text', () => {
    renderEmptyState();
    expect(
      screen.getByText('Publica tu primer libro para empezar a buscar reseñas.'),
    ).toBeInTheDocument();
  });

  it('renders the CTA link with correct label', () => {
    renderEmptyState();
    expect(
      screen.getByRole('link', { name: /añadir mi primer libro/i }),
    ).toBeInTheDocument();
  });
});

// ─── Nested-anchor regression (invalid-HTML bug) ─────────────────────────────
// Bug: `<Link passHref><styled.a href="...">` produced <a><a> — invalid HTML.
// Fix: `styled(Link)` renders directly as a single <a> element.

describe('BooksEmptyState — nested-anchor regression', () => {
  it('does not nest an <a> inside another <a>', () => {
    // REGRESSION: before the fix, PrimaryButton was styled.a wrapped in
    // <Link passHref>, producing an <a> nested inside the Link's own <a>.
    const { container } = renderEmptyState();

    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });

  it('renders the CTA as a single <a> element', () => {
    // REGRESSION: styled(Link) must produce exactly one anchor tag for the CTA.
    const { container } = renderEmptyState();

    const allAnchors = container.querySelectorAll('a');
    expect(allAnchors).toHaveLength(1);
    expect(allAnchors[0].tagName).toBe('A');
  });

  it('CTA anchor has href pointing to the add-book section', () => {
    // REGRESSION: the single anchor must carry the correct navigation target.
    renderEmptyState();

    const ctaLink = screen.getByRole('link', { name: /añadir mi primer libro/i });
    expect(ctaLink).toHaveAttribute('href', '/account?section=addBook');
  });
});
