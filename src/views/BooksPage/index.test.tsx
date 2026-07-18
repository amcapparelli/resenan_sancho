/**
 * View-level integration test for BooksPage's fetch/filter contract.
 *
 * Bug fixed: `handleFilter` used to call `listRequest({ ...filters, page: 1 })`
 * directly, out of band with state. Pagination state (`appliedFilters.page`)
 * never actually reset, so pressing "Filtrar" while on page 1 refetched (by
 * accident, via the direct call) but left the pagination UI pointing at
 * whatever page it was on before, and going back to page 1 afterwards did
 * nothing because state hadn't changed.
 *
 * Fix: `useListFilters` centralises `appliedFilters` as the single source of
 * truth, and the view's fetch effect depends on `appliedFilters` (object
 * identity) alone:
 *   useEffect(() => { listRequest(...) }, [appliedFilters]);
 *
 * This suite does NOT re-test the hook's internals (see
 * `useListFilters.test.tsx` for that) — it locks in the CONTRACT between the
 * hook and this view: the view must fetch on `appliedFilters` identity, and
 * on nothing else. A hook-only test cannot catch a regression where the view
 * itself is rewired to call `listRequest` directly or narrows its effect
 * dependency (e.g. to `appliedFilters.page`) — both silently reintroduce the
 * exact original symptom while every other test still passes.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import BooksPage from './index';

// react-i18next: return the last segment of the key as a plain string, same
// precedent as BookCard.test.tsx — genre option labels render predictably
// without loading real translation files.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('.').pop() ?? key,
  }),
}));

// ─── Fetch mock helpers ─────────────────────────────────────────────────────

/** Shape returned by the real /books endpoint. Empty `books` keeps card
 * rendering (and its own dependencies) out of scope for this suite — only
 * the request/response contract is under test here. `totalPages` is set high
 * enough that Pagination always renders. */
function jsonResponse(totalPages = 10) {
  return {
    ok: true,
    json: async () => ({ books: [], totalElements: 0, totalPages }),
  } as Response;
}

function mockFetch(totalPages = 10) {
  // jsdom in this Jest setup has no global `fetch` to spy on, so it's
  // assigned directly rather than via `jest.spyOn(global, 'fetch')`.
  const fetchMock = jest.fn().mockResolvedValue(jsonResponse(totalPages));
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

function renderPage() {
  return render(
    <ThemeProvider theme={StyledTheme}>
      <BooksPage />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('BooksPage — fetch/filter contract', () => {
  it('fetches exactly once on mount', async () => {
    const fetchSpy = mockFetch();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    // No further microtask-queued fetches sneak in afterwards.
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
  });

  it('does not fetch when changing a filter input without pressing "Filtrar"', async () => {
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    const genreSelect = screen.getByLabelText(/género literario/i);
    await user.selectOptions(genreSelect, 'ADV');

    const formatSelect = screen.getByLabelText(/formato del libro/i);
    await user.selectOptions(formatSelect, 'papel');

    // Draft edits alone must never trigger a request.
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches exactly one additional request when pressing "Filtrar" while already on page 1', async () => {
    // REGRESSION: this is the case the reviewer's mutation breaks. Narrowing
    // the view's effect dependency to `appliedFilters.page` means a fresh
    // `appliedFilters` object with the SAME page number no longer triggers a
    // refetch, because `page` itself didn't change — reproducing the exact
    // original bug (pressing "Filtrar" on page 1 does nothing).
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    await user.selectOptions(screen.getByLabelText(/género literario/i), 'ADV');
    await user.click(screen.getByRole('button', { name: /filtrar libros/i }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
  });

  it('resets to page 1 when filtering from a later page, and highlights page 1 again', async () => {
    // Regression for the originally reported symptom: going to page 3, then
    // filtering, must both request page=1 AND move the pagination UI back to
    // page 1 (not just silently refetch page 3's results under a new filter).
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    // Pagination only renders once loading settles after the mount fetch
    // resolves, so wait for the button rather than assuming it's already there.
    const page3Button = await screen.findByRole('button', { name: 'Página 3' });
    await user.click(page3Button);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
    await waitFor(() => (
      expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
    ));

    await user.click(screen.getByRole('button', { name: /filtrar libros/i }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(3));

    const lastCallUrl = fetchSpy.mock.calls[fetchSpy.mock.calls.length - 1][0] as string;
    const params = new URL(lastCallUrl).searchParams;
    expect(params.get('page')).toBe('1');

    await waitFor(() => (
      expect(screen.getByRole('button', { name: 'Página 1' })).toHaveAttribute('aria-current', 'page')
    ));
    expect(screen.getByRole('button', { name: 'Página 3' })).not.toHaveAttribute('aria-current');
  });

  it('does not fetch again when clicking the page already active', async () => {
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    // Already on page 1 — clicking it again must be a no-op, not a redundant request.
    const page1Button = await screen.findByRole('button', { name: 'Página 1' });
    await user.click(page1Button);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
