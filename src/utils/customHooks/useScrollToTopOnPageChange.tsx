import { RefObject, useEffect, useRef } from 'react';

/**
 * Returns a ref to attach to the scroll anchor of a paginated list. Whenever
 * `page` changes, that element is scrolled back into view.
 *
 * Without this, changing page keeps the browser scroll where it was (usually
 * the bottom of the previous page of results), so the user lands in the middle
 * of the new list.
 *
 * We scroll to an element instead of the top of the document on purpose: these
 * pages open with a tall PageHeader, and sending the user all the way up would
 * force them to scroll past it again on every page change.
 *
 * The hook is deliberately anchor-agnostic: callers decide how high the
 * viewport lands by choosing which element gets the ref (and by giving it a
 * `scroll-margin-top`). Today both list views anchor at the filter bar so the
 * filters stay visible after the jump.
 */
const useScrollToTopOnPageChange = <T extends HTMLElement>(
  page: number,
): RefObject<T> => {
  const containerRef = useRef<T>(null);
  const previousPage = useRef(page);

  useEffect(() => {
    // Skips the initial mount. With the current `[page]` dep array the effect
    // only re-runs when the page actually changes, but the guard keeps this
    // correct if the dependency list ever grows.
    if (previousPage.current === page) return;
    previousPage.current = page;

    // Effects never run on the server, so `window` is safe from here on.
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    container.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [page]);

  return containerRef;
};

export default useScrollToTopOnPageChange;
