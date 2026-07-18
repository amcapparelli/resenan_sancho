/**
 * Regression tests for useListFilters.
 *
 * Bug fixed: clicking "Filtrar" on /books and /reviewers fetched page 1 from
 * the API but never reset `filters.page` in state. The pagination UI kept
 * highlighting the old page, clicking page 1 afterwards did nothing (the
 * fetch effect keyed on `filters.page`, which hadn't changed), and no
 * scroll-to-top fired.
 *
 * Fix: this hook splits `draftFilters` (bound to inputs, no fetch) from
 * `appliedFilters` (the only thing the fetch effect depends on).
 * `applyFilters()` always writes a FRESH `{ values, page: 1 }` object, and
 * `goToPage(page)` returns the SAME reference when the page is unchanged.
 */
import { act, renderHook } from '@testing-library/react';

import useListFilters from './useListFilters';

describe('useListFilters', () => {
  it('resets the applied page to 1 after navigating away and applying filters', () => {
    // Regression test for the original bug: goToPage(3) then applyFilters()
    // must bring appliedFilters.page back to 1, not leave it at 3.
    const { result } = renderHook(() => useListFilters());

    act(() => {
      result.current.goToPage(3);
    });
    expect(result.current.appliedFilters.page).toBe(3);

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.appliedFilters.page).toBe(1);
  });

  it('produces a new appliedFilters reference when applying filters while already on page 1', () => {
    // Regression test for the subtle no-op trap: a naive fix could just set
    // `page = 1` and, when already on page 1, leave `appliedFilters`
    // unchanged in value AND reference. A fetch effect keyed on
    // `appliedFilters` identity would then silently skip the refetch.
    // Reference identity is the actual contract, not just the value.
    const { result } = renderHook(() => useListFilters());

    const beforeApply = result.current.appliedFilters;
    expect(beforeApply.page).toBe(1);

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.appliedFilters).not.toBe(beforeApply);
    expect(result.current.appliedFilters.page).toBe(1);
  });

  it('does not change appliedFilters when editing draftFilters', () => {
    // Typing in a filter input must not trigger a fetch: appliedFilters is
    // the only thing the fetch effect depends on, and it stays untouched
    // until the user explicitly applies.
    const { result } = renderHook(() => useListFilters({ genre: 'novel' }));

    const beforeEdit = result.current.appliedFilters;

    act(() => {
      result.current.setDraftFilter('genre', 'poetry');
    });

    expect(result.current.draftFilters).toEqual({ genre: 'poetry' });
    expect(result.current.appliedFilters).toBe(beforeEdit);
    expect(result.current.appliedFilters.values).toEqual({ genre: 'novel' });
  });

  it('commits the current draft values into appliedFilters.values on apply', () => {
    const { result } = renderHook(() => useListFilters({ genre: 'novel' }));

    act(() => {
      result.current.setDraftFilter('genre', 'poetry');
      result.current.setDraftFilter('format', 'ebook');
    });

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.appliedFilters.values).toEqual({
      genre: 'poetry',
      format: 'ebook',
    });
  });

  it('changes the page without disturbing the currently applied values', () => {
    const { result } = renderHook(() => useListFilters({ genre: 'novel' }));

    act(() => {
      result.current.setDraftFilter('genre', 'poetry');
    });
    act(() => {
      result.current.applyFilters();
    });
    expect(result.current.appliedFilters.values).toEqual({ genre: 'poetry' });

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.appliedFilters.page).toBe(2);
    expect(result.current.appliedFilters.values).toEqual({ genre: 'poetry' });
  });

  it('returns the same appliedFilters reference when going to the already-current page', () => {
    // Clicking the page you're already on is a no-op, not a redundant request.
    const { result } = renderHook(() => useListFilters());

    act(() => {
      result.current.goToPage(2);
    });
    const afterFirstNavigation = result.current.appliedFilters;

    act(() => {
      result.current.goToPage(2);
    });

    expect(result.current.appliedFilters).toBe(afterFirstNavigation);
  });
});
