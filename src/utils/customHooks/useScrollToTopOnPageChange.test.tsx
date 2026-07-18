/**
 * Regression tests for useScrollToTopOnPageChange.
 *
 * Bug fixed: changing the page via pagination on /books and /reviewers loaded
 * new results but left the scroll position near the bottom of the previous
 * list, so the user landed in the middle of the new list instead of at its top.
 * Fix: this hook returns a ref for the results container and calls
 * `scrollIntoView` on it whenever the `page` argument changes, skipping the
 * initial mount and any re-render where `page` is unchanged.
 */
import React from 'react';
import { render } from '@testing-library/react';

import useScrollToTopOnPageChange from './useScrollToTopOnPageChange';

// ─── matchMedia helper ───────────────────────────────────────────────────────
// jsdom does not implement window.matchMedia, and no existing test in the repo
// mocks it yet, so we define a small local helper for `prefers-reduced-motion`.
function mockMatchMedia(matches: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

const scrollIntoViewMock = Element.prototype.scrollIntoView as jest.Mock;

// Real component that attaches the ref via JSX, exactly like BooksPage/
// ReviewersPage do. This matters for timing: React attaches refs during the
// commit phase, *before* effects run, so this is the only way to reproduce
// the real-world ordering (ref already populated when the effect fires).
function TestComponent({ page }: { page: number }) {
  const ref = useScrollToTopOnPageChange<HTMLDivElement>(page);
  return <div ref={ref}>results for page {page}</div>;
}

describe('useScrollToTopOnPageChange', () => {
  beforeEach(() => {
    // `jest.setup.ts` stubs Element.prototype.scrollIntoView globally (a
    // module-level mock shared across this file's tests), and jest.config.js
    // does not set `clearMocks`, so call counts would otherwise leak between
    // test cases and break "called exactly once" assertions.
    jest.clearAllMocks();
    mockMatchMedia(false);
  });

  it('does not scroll on initial mount', () => {
    // REGRESSION: a naive implementation that scrolls on every effect run
    // (without the previousPage guard) would scroll immediately on mount.
    render(<TestComponent page={1} />);

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('scrolls exactly once when the page number actually changes', () => {
    const { rerender } = render(<TestComponent page={1} />);

    rerender(<TestComponent page={2} />);

    // REGRESSION: this is the core fix — changing pages must trigger exactly
    // one scroll call on the results container.
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
  });

  it('does not scroll on a re-render where the page number is unchanged', () => {
    const { rerender } = render(<TestComponent page={1} />);

    rerender(<TestComponent page={1} />);

    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });

  it('uses smooth scrolling when prefers-reduced-motion does not match', () => {
    mockMatchMedia(false);
    const { rerender } = render(<TestComponent page={1} />);

    rerender(<TestComponent page={2} />);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('uses auto scrolling when prefers-reduced-motion: reduce matches', () => {
    mockMatchMedia(true);
    const { rerender } = render(<TestComponent page={1} />);

    rerender(<TestComponent page={2} />);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    });
  });

  it('does not throw and does not scroll when the ref was never attached', () => {
    // The container ref may be null if the consumer never attaches it to an
    // element (or it has not mounted yet); the hook must no-op safely.
    function UnattachedRefComponent({ page }: { page: number }) {
      useScrollToTopOnPageChange<HTMLDivElement>(page);
      return <div>results for page {page}</div>;
    }

    const { rerender } = render(<UnattachedRefComponent page={1} />);

    expect(() => rerender(<UnattachedRefComponent page={2} />)).not.toThrow();
    expect(scrollIntoViewMock).not.toHaveBeenCalled();
  });
});
