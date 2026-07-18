import { useCallback, useState } from 'react';

/** Filter values as they travel to the API: everything ends up in a query string. */
export type FilterValues = Record<string, string>;

/**
 * The filters the currently displayed results correspond to. `page` is kept
 * apart from `values` so it stays a number (the query string is built by
 * merging both).
 */
export interface AppliedFilters {
  values: FilterValues;
  page: number;
}

export interface UseListFiltersResult {
  /** Values bound to the filter inputs. Editing them does NOT trigger a fetch. */
  draftFilters: FilterValues;
  setDraftFilter: (name: string, value: string) => void;
  /**
   * Single source of truth for fetching: list views run their request effect on
   * this object's identity, so one change here means exactly one request.
   */
  appliedFilters: AppliedFilters;
  /** Commits the draft values and goes back to the first page. */
  applyFilters: () => void;
  goToPage: (page: number) => void;
}

const FIRST_PAGE = 1;

/**
 * Two-stage filter state for paginated list views.
 *
 * The draft/applied split exists so that typing or picking a value doesn't hit
 * the API on every keystroke: results only change when the user presses
 * "Filtrar" (applyFilters) or moves to another page (goToPage). Both actions
 * write a brand new `appliedFilters` object, which is what the view's fetch
 * effect depends on — state drives the request, never the other way round.
 */
const useListFilters = (initialFilters: FilterValues = {}): UseListFiltersResult => {
  const [draftFilters, setDraftFilters] = useState<FilterValues>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    values: initialFilters,
    page: FIRST_PAGE,
  });

  const setDraftFilter = useCallback((name: string, value: string) => {
    setDraftFilters((current) => ({ ...current, [name]: value }));
  }, []);

  const applyFilters = useCallback(() => {
    // A fresh object even when the values are identical: pressing "Filtrar"
    // must always re-run the request. Page goes back to the first one because
    // the result set changes and the old page number may no longer exist.
    setAppliedFilters({ values: draftFilters, page: FIRST_PAGE });
  }, [draftFilters]);

  const goToPage = useCallback((page: number) => {
    // Keeping the same reference when the page didn't change avoids a redundant
    // request if the user clicks the page they are already on.
    setAppliedFilters((current) => (
      current.page === page ? current : { ...current, page }
    ));
  }, []);

  return {
    draftFilters,
    setDraftFilter,
    appliedFilters,
    applyFilters,
    goToPage,
  };
};

export default useListFilters;
