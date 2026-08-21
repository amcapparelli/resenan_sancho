---
name: view-integration-fetch-tests
description: How to write view-level integration tests that assert fetch call counts/params for BooksPage/ReviewersPage-shaped views, and how to fail-first-prove they catch view-not-hook bugs
metadata:
  type: project
---

## When a bug lives in the VIEW, not the hook, hook tests can't catch it
Case study: `useListFilters` (see [[hook-testing-patterns]]) had a
well-tested `applyFilters`/`goToPage` API, but the original bug was that
`BooksPage`'s `handleFilter` called `listRequest(...)` directly, out of band
with `appliedFilters` state. A code reviewer proved 42 existing tests (incl.
6 mutation-verified hook tests) all stayed green even after reintroducing the
exact original symptom, by either:
1. Narrowing the view's fetch effect dep from `[appliedFilters]` to
   `[appliedFilters.page]`, or
2. Rewiring `onFilter` to call `listRequest` directly instead of
   `applyFilters`.
**Lesson: when the contract under test is "component X fetches on Y's
identity, and only Y's identity," you need a co-located view-level
integration test that mounts the real view and counts real fetch calls —
a hook unit test cannot see the view's `useEffect` dependency array or its
`onFilter` wiring.**

## global.fetch does not exist in this project's jsdom — do not jest.spyOn it
`jest.spyOn(global, 'fetch')` throws `Property 'fetch' does not exist in the
provided object'` in this Jest/jsdom setup (no fetch polyfill loaded).
Correct pattern:
```ts
function mockFetch(totalPages = 10) {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ books: [], totalElements: 0, totalPages }),
  } as Response);
  global.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}
```
No `afterEach` restore is needed/possible (there's nothing to restore to);
`beforeEach(() => jest.clearAllMocks())` is enough since each test reassigns
`global.fetch` fresh via `mockFetch()`.

## Return empty list arrays from the mock response — content isn't in scope
For `BooksPage`/`ReviewersPage` fetch-contract tests, the response's
`books`/`reviewers` array can stay `[]`. This sidesteps needing a full
`Book`/`Reviewer` fixture (which `BookCard`/`ReviewerCard` would otherwise
require) — the assertions here are about fetch call counts and query params,
not rendered card content. Only `totalPages` needs to be set high (e.g. 10)
so `Pagination` renders (`!loading && totalPages > 1`).

## Pagination buttons need findByRole, not getByRole, right after a fetch
`Pagination` only renders once `loading` flips to `false` after the mount
fetch's promise chain resolves. A `waitFor` on the fetch call count does NOT
guarantee the subsequent state update/re-render has committed yet. Querying
pagination buttons with `screen.getByRole(...)` immediately after that
`waitFor` intermittently fails with "unable to find element." Fix: use
`await screen.findByRole('button', { name: 'Página 3' })` for the first
pagination interaction after a fetch settles, and wrap later `aria-current`
assertions in their own `waitFor`.

## Pagination aria-labels need EXACT name matching, not regex substring
`Pagination` buttons have `aria-label={\`Página ${page}\`}`. A regex like
`/página 1/i` matches BOTH "Página 1" AND "Página 10" (substring match) —
`getByRole` then throws "multiple elements found." Always pass the exact
string (`{ name: 'Página 1' }`), not a case-insensitive regex, when the
page-number set can include multi-digit numbers under the same prefix.

## Fail-first proof recipe for a view-effect-dependency bug
1. Apply the exact single-line mutation the reviewer described (e.g. change
   `}, [appliedFilters]);` to `}, [appliedFilters.page]);` in the view file
   directly with Edit).
2. Run only the new test file, confirm exactly the expected case fails (not
   a setup crash) — read the actual assertion failure, not just red/green.
3. Also try a second independent mutation if requested (e.g. rewiring
   `onFilter` to call `listRequest` directly, bypassing `applyFilters`) —
   this one is caught by a DIFFERENT assertion (the pagination
   `aria-current` reset check), not the raw fetch-count check, since the
   direct call still fires a request with a hardcoded `page: 1` — it just
   never updates `appliedFilters` state, so the UI stays stuck on the old
   page. Worth keeping both mutations in mind: they fail via different
   assertions, so a test suite needs both a call-count check AND a
   state/UI-reflects-page check to catch both variants.
4. Restore the view file with Edit back to its exact original text.
5. `git diff <file>` must be empty afterward — confirms no lingering mutation
   before handing back.

## BooksPage/ReviewersPage share an identical fetch-effect shape
Both views use `useListFilters` + a `use*ListFetch` hook + the same
`useEffect(() => { listRequest(...) }, [appliedFilters]);` pattern. When one
gets a view-level fetch-contract regression test, mirror it to the other
almost verbatim (adjust: response shape key name `books` vs `reviewers`,
filter bar has an extra search-text input on ReviewersPage, button
aria-labels differ — "Filtrar libros" vs "Filtrar reseñadores"). Did NOT
introduce a shared test helper file for this — kept both test files fully
self-contained (per existing `BookCard.test.tsx` convention), since the
duplication is small (~140 lines) and a shared helper would add
indirection for marginal savings.

See [[project-test-harness]] for the general harness conventions and
[[hook-testing-patterns]] for hook-level (not view-level) testing notes.
