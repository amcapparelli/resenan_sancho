/**
 * Regression tests for BookDetailCTA.
 *
 * Bug fixed: when isLoggedIn=true and copies<=0, the "Pedir un ejemplar" button
 * was enabled, allowing onRequest to fire with no copies available. The fix
 * added disabled={!isAvailable} to the RequestButton.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import BookDetailCTA from './BookDetailCTA';

// next/router is used inside the unauth branch; mock it so tests that render
// the logged-in branch don't blow up on missing router context.
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/books/test-book',
    pathname: '/books/test-book',
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderCTA(props: { isLoggedIn: boolean; copies: number; onRequest: () => void }) {
  const { isLoggedIn, copies, onRequest } = props;
  return render(
    <ThemeProvider theme={StyledTheme}>
      <BookDetailCTA isLoggedIn={isLoggedIn} copies={copies} onRequest={onRequest} />
    </ThemeProvider>,
  );
}

// ─── Logged-in branch ────────────────────────────────────────────────────────

describe('BookDetailCTA — logged-in user', () => {
  describe('when copies === 0 (out of stock)', () => {
    it('renders the "Pedir un ejemplar" button as disabled', () => {
      // REGRESSION: before the fix, disabled={!isAvailable} was absent,
      // so the button was always enabled when isLoggedIn=true.
      // When disabled, the button's aria-label is "No disponible por ahora"
      // (set by the component), which becomes its accessible name.
      const onRequest = jest.fn();
      renderCTA({ isLoggedIn: true, copies: 0, onRequest });

      const button = screen.getByRole('button', { name: /no disponible por ahora/i });
      expect(button).toBeDisabled();
    });

    it('does not call onRequest when the disabled button is clicked', async () => {
      // REGRESSION: clicking the enabled button used to fire onRequest even with
      // zero copies, triggering a request for an unavailable book.
      const user = userEvent.setup();
      const onRequest = jest.fn();
      renderCTA({ isLoggedIn: true, copies: 0, onRequest });

      const button = screen.getByRole('button', { name: /no disponible por ahora/i });
      // userEvent respects the disabled attribute and will not fire the click handler
      await user.click(button);

      expect(onRequest).not.toHaveBeenCalled();
    });

    it('shows "No disponible por ahora" availability text', () => {
      renderCTA({ isLoggedIn: true, copies: 0, onRequest: jest.fn() });
      expect(screen.getByText('No disponible por ahora')).toBeInTheDocument();
    });
  });

  describe('when copies > 0 (in stock)', () => {
    it('renders the "Pedir un ejemplar" button as enabled', () => {
      renderCTA({ isLoggedIn: true, copies: 3, onRequest: jest.fn() });

      const button = screen.getByRole('button', { name: /pedir un ejemplar/i });
      expect(button).toBeEnabled();
    });

    it('calls onRequest when the button is clicked', async () => {
      const user = userEvent.setup();
      const onRequest = jest.fn();
      renderCTA({ isLoggedIn: true, copies: 3, onRequest });

      await user.click(screen.getByRole('button', { name: /pedir un ejemplar/i }));

      expect(onRequest).toHaveBeenCalledTimes(1);
    });

    it('shows plural availability text for multiple copies', () => {
      renderCTA({ isLoggedIn: true, copies: 3, onRequest: jest.fn() });
      expect(screen.getByText('3 ejemplares disponibles')).toBeInTheDocument();
    });

    it('shows singular availability text for exactly 1 copy', () => {
      renderCTA({ isLoggedIn: true, copies: 1, onRequest: jest.fn() });
      expect(screen.getByText('1 ejemplar disponible')).toBeInTheDocument();
    });
  });
});

// ─── Unauthenticated branch ──────────────────────────────────────────────────

describe('BookDetailCTA — unauthenticated user', () => {
  it('shows the "Crear cuenta gratis" link instead of the request button', () => {
    renderCTA({ isLoggedIn: false, copies: 5, onRequest: jest.fn() });

    expect(
      screen.getByRole('link', { name: /crear cuenta gratis/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /pedir un ejemplar/i })).not.toBeInTheDocument();
  });

  it('shows the "Inicia sesión" link', () => {
    renderCTA({ isLoggedIn: false, copies: 5, onRequest: jest.fn() });
    expect(screen.getByRole('link', { name: /inicia sesión/i })).toBeInTheDocument();
  });

  it('shows the unauthenticated prompt text', () => {
    renderCTA({ isLoggedIn: false, copies: 5, onRequest: jest.fn() });
    expect(
      screen.getByText('Para pedir un ejemplar necesitas una cuenta gratuita.'),
    ).toBeInTheDocument();
  });
});

// ─── Nested-anchor regression (invalid-HTML bug) ─────────────────────────────
// Bug: the old Next 9 pattern `<Link passHref><styled.a /></Link>` caused Link
// to render its own <a> wrapping the child <a>, producing invalid HTML in Next 15.
// Fix: PrimaryButtonAnchor and LoginLink are now `styled(Link)` rendered directly
// (no wrapper Link, no passHref), so each produces exactly one <a>.

describe('BookDetailCTA — nested-anchor regression', () => {
  it('does not nest an <a> inside another <a> in the unauthenticated branch', () => {
    // REGRESSION: before the fix, <Link passHref><PrimaryButtonAnchor> produced
    // <a href="/register"><a ...>Crear cuenta gratis</a></a> — invalid HTML.
    const { container } = renderCTA({ isLoggedIn: false, copies: 5, onRequest: jest.fn() });

    expect(container.querySelectorAll('a a')).toHaveLength(0);
  });

  it('renders the register link as a standalone <a> with href="/register"', () => {
    // REGRESSION: styled(Link) must produce a single navigable anchor, not a nested one.
    renderCTA({ isLoggedIn: false, copies: 5, onRequest: jest.fn() });

    const registerLink = screen.getByRole('link', { name: /crear cuenta gratis/i });
    expect(registerLink.tagName).toBe('A');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('renders the login link as a standalone <a> with an href containing "/login"', () => {
    // REGRESSION: styled(Link) for LoginLink must resolve to a single <a>
    // whose href encodes the current path as a "previous" query param.
    renderCTA({ isLoggedIn: false, copies: 5, onRequest: jest.fn() });

    const loginLink = screen.getByRole('link', { name: /inicia sesión/i });
    expect(loginLink.tagName).toBe('A');
    expect(loginLink.getAttribute('href')).toMatch(/^\/login/);
  });
});
