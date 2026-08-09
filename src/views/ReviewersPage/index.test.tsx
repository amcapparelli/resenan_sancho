/**
 * View-level integration test for ReviewersPage's fetch/filter contract.
 *
 * ReviewersPage mirrors BooksPage's shape exactly (same `useListFilters` +
 * fetch-effect pattern), so it carries the same regression risk: the bug
 * originally lived in the view (`handleFilter` calling `listRequest`
 * directly, out of band with state), not in the hook. See
 * `src/views/BooksPage/index.test.tsx` for the full fail-first proof against
 * that bug (narrowing the effect dep to `appliedFilters.page`, and rewiring
 * `onFilter` to call `listRequest` directly) — the same two mutations apply
 * here since the code is structurally identical.
 *
 * This suite locks in the same contract for ReviewersPage: fetch on
 * `appliedFilters` identity, and on nothing else.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import ReviewersPage from './index';

// react-i18next: return the last segment of the key as a plain string, same
// precedent as BookCard.test.tsx.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('.').pop() ?? key,
  }),
}));

// next/router: the view syncs applied facets into the URL via
// `router.push(..., { shallow: true })`. Without a mounted router `useRouter`
// throws "NextRouter was not mounted", so supply a router shape with a `push`
// spy — same precedent as BooksPage. The spy is hoisted (jest allows
// out-of-scope refs prefixed with `mock`) so tests can assert the URL-sync
// contract; it's reset per test in `beforeEach`.
const mockRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/reviewers',
    query: {},
    push: mockRouterPush,
  }),
}));

// ─── Fetch mock helpers ─────────────────────────────────────────────────────

/** Shape returned by the real /reviewers endpoint. Empty `reviewers` keeps
 * card rendering out of scope — only the request/response contract is under
 * test here. `totalPages` is set high enough that Pagination always renders. */
function jsonResponse(totalPages = 10) {
  return {
    ok: true,
    json: async () => ({ reviewers: [], totalElements: 0, totalPages }),
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
      <ReviewersPage />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ReviewersPage — fetch/filter contract', () => {
  it('fetches exactly once on mount', async () => {
    const fetchSpy = mockFetch();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
  });

  it('does not fetch when changing filter inputs without pressing "Filtrar"', async () => {
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    await user.type(
      screen.getByLabelText(/buscar por nombre o descripción/i),
      'María',
    );
    await user.selectOptions(screen.getByLabelText(/género literario/i), 'ADV');
    await user.selectOptions(screen.getByLabelText(/formato del libro/i), 'papel');

    // Draft edits alone must never trigger a request.
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches exactly one additional request when pressing "Filtrar" while already on page 1', async () => {
    // REGRESSION: same case that catches the narrowed-dep mutation on
    // BooksPage — see that file's fail-first proof.
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    // Type a free-text search alongside the genre pick: searchText must reach
    // the client fetch but must NOT reach the pushed URL (client-only filter).
    await user.type(
      screen.getByLabelText(/buscar por nombre o descripción/i),
      'María',
    );
    await user.selectOptions(screen.getByLabelText(/género literario/i), 'ADV');

    // Isolate the push caused by the click from the mount push so the
    // "once per applied change" contract is asserted cleanly.
    mockRouterPush.mockClear();
    await user.click(screen.getByRole('button', { name: /filtrar reseñadores/i }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));

    // The client fetch DOES carry searchText (it filters results).
    const lastCallUrl = fetchSpy.mock.calls[fetchSpy.mock.calls.length - 1][0] as string;
    const fetchParams = new URL(lastCallUrl).searchParams;
    expect(fetchParams.get('searchText')).toBe('María');

    // URL-sync contract: applying facets shallow-routes exactly once with the
    // public query — genre CODE (ADV) mapped to its SLUG (aventura), page 1
    // dropped, and searchText deliberately absent from the indexable URL.
    expect(mockRouterPush).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith(
      { pathname: '/reviewers', query: { genre: 'aventura' } },
      undefined,
      { shallow: true },
    );
    const pushedQuery = mockRouterPush.mock.calls[0][0].query;
    expect(pushedQuery).not.toHaveProperty('searchText');
  });

  it('resets to page 1 when filtering from a later page, and highlights page 1 again', async () => {
    const fetchSpy = mockFetch();
    const user = userEvent.setup();
    renderPage();

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));

    const page3Button = await screen.findByRole('button', { name: 'Página 3' });
    await user.click(page3Button);
    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(2));
    await waitFor(() => (
      expect(screen.getByRole('button', { name: 'Página 3' })).toHaveAttribute('aria-current', 'page')
    ));

    await user.click(screen.getByRole('button', { name: /filtrar reseñadores/i }));

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

    const page1Button = await screen.findByRole('button', { name: 'Página 1' });
    await user.click(page1Button);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
