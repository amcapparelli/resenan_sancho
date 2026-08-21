---
name: hook-testing-patterns
description: How to test custom hooks that read refs and DOM/browser APIs (scrollIntoView, matchMedia) with correct React commit/effect timing
metadata:
  type: project
---

## renderHook + manual ref attachment does NOT reproduce real ref timing
When testing a hook that returns a `RefObject` meant to be attached via JSX
(e.g. `useScrollToTopOnPageChange`), do NOT use `@testing-library/react`'s
`renderHook` and then manually set `result.current.current = element` after
the fact. `renderHook` doesn't render any JSX, so nothing attaches the ref
during React's commit phase — by the time you manually assign `.current`,
the mount effect has already run and seen a null ref. This silently
neuters "does not scroll on mount" style assertions: they pass even against
a genuinely buggy hook (missing mount-guard), because the container was null
at effect time for an unrelated reason (test artifact, not the hook's fix).

**Fix:** render a tiny real test component that calls the hook and spreads
the returned ref onto a real JSX element:
```tsx
function TestComponent({ page }: { page: number }) {
  const ref = useSomeHook<HTMLDivElement>(page);
  return <div ref={ref}>content</div>;
}
render(<TestComponent page={1} />);
rerender(<TestComponent page={2} />);
```
React attaches refs during commit, before effects run, so this matches real
usage (e.g. `BooksPage`/`ReviewersPage` attaching the ref via JSX) and will
correctly fail if the mount-guard is removed.

**How I caught this:** during fail-first verification (temporarily removing
the mount guard from `useScrollToTopOnPageChange`), the `renderHook` +
manual-attach version of the "no scroll on mount" test still passed against
the broken hook — a false negative. Rewriting with a real component made it
fail as expected. Always do the fail-first check with the *actual* test
file, not just trust that assertions "look" correct.

## window.matchMedia mock (no repo precedent existed as of 2026-07-18)
jsdom doesn't implement `matchMedia`. No existing test file mocked it yet, so
this is now the reference pattern:
```ts
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
```
Call it in `beforeEach` (or per-test before render) with the desired
`matches` value to simulate `prefers-reduced-motion: reduce` on/off.

## jest.config.js has no `clearMocks`/`resetMocks`
Confirmed 2026-07-18: neither is set. `jest.setup.ts` stubs
`Element.prototype.scrollIntoView = jest.fn()` at module scope (shared
across every test in a file), so any test asserting call counts
(`toHaveBeenCalledTimes`, `not.toHaveBeenCalled`) on a globally-stubbed
API MUST call `jest.clearAllMocks()` in `beforeEach`, or counts leak
across test cases within the same file. See
[[project-test-harness]] for the rest of the harness setup.

## Fail-first proof pattern for a hook fix
To prove a regression test actually catches a bug in a hook (not just a
component), temporarily edit the hook's source to reintroduce the bug
(e.g. delete the early-return guard), rerun the test file, confirm the
specific assertions fail with the *expected* diff (not a setup crash),
then restore the hook to its exact original text and rerun to confirm
green. Always `git status`/`git diff` the source file afterward to make
sure no injected-bug comment or code was left behind.

## Guard the ref-write, not just the early-return, for a "previous value" pattern
`useScrollToTopOnPageChange` guards a `previousPage` ref with
`if (previousPage.current === page) return; previousPage.current = page;`.
A first pass at this test suite covered the early-return (mount, unchanged
page) and the "changes once" cases, but ALL of those stay green even if
`previousPage.current = page;` is deleted entirely — a mutation a reviewer
could introduce and no test would catch. The reason: with a `[page]` dep
array, single forward transitions (1->2) never distinguish "did we update
previousPage" from "was previousPage already behind." The only scenario
that requires the ref actually being written is a **round trip**:
1 -> 2 -> 1. Correct code scrolls twice (previousPage tracks 2, then sees
1 != 2). With the write deleted, previousPage stays stuck at the original
value and the return trip is wrongly treated as a no-op (scrolls once).
**General lesson:** whenever a hook/reducer keeps a "previous value" ref
to diff against, add a back-and-forth/round-trip case, not just monotonic
transitions — monotonic sequences alone can pass with the assignment
missing.

## Calling two hook actions in one `act()` can read a stale closure
When a test does `act(() => { result.current.setX(...); result.current.applyY(); })`,
`result.current` inside that callback is captured ONCE, from before the act
block runs — both calls hit the *same* pre-act render's functions. If the
second function's `useCallback` closes over state set by the first call
(e.g. `applyFilters` depends on `[draftFilters]` and is called right after
`setDraftFilter` in the same act), it will use the OLD state value, not the
one just set, because React batches the updates and hasn't re-rendered yet
mid-callback. Caught this in `useListFilters.test.tsx`: `setDraftFilter` then
`applyFilters` in one `act()` committed the pre-edit draft values. Fix: split
into two separate `act()` calls so `result.current` is re-read from the
latest render between them. This is safe to skip only when the second call
uses a functional state updater `(current) => ...` that reads fresh state
itself (e.g. calling `setDraftFilter` twice in a row is fine, since it
updates via `(current) => ({ ...current, [name]: value })` internally).

## jsx-one-expression-per-line lint rule applies to interpolated text nodes
`react/jsx-one-expression-per-line` flags `<div>text {expr}</div>` (mixed
literal + expression children on one line), including in test helper
components. Fix: template-literal the whole child into a single
expression, e.g. `<div>{\`results for page ${page}\`}</div>`. Applies
inside test files too, not just production JSX.
