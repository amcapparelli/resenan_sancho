---
name: project-test-harness
description: Jest + RTL test harness setup details for this Next 15 / React 18 / TS project
metadata:
  type: project
---

The test harness was bootstrapped from scratch on branch `test/book-cta-regression-and-harness`.

## Key files created
- `jest.config.js` — uses `next/jest` (createJestConfig) with `testEnvironment: 'jsdom'` and `setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']`
- `jest.setup.ts` — just `import '@testing-library/jest-dom'`

## Dev deps added
- `@testing-library/jest-dom` (^6.x) — custom matchers (toBeDisabled, toBeInTheDocument, etc.)
- `@testing-library/user-event` (^14.x) — preferred over fireEvent; use `userEvent.setup()` + `await user.click()`

## Already present (no install needed)
- `jest@^29.7.0`, `jest-environment-jsdom@^29.7.0`, `@testing-library/react@^16.0.1`
- `babel-jest@29.x` (installed as transitive dep of Next)
- `next/jest` module available at `node_modules/next/jest.js` — handles SWC transform, CSS mocking, module aliases

## Test location convention
New tests are co-located: `src/views/SomeView/SomeComponent.test.tsx`. The old `tests/` directory at root contains only legacy `.test.js` files (skipped) — ignore for new work.

## Mocking patterns
- `next/router`: `jest.mock('next/router', () => ({ useRouter: () => ({ asPath: '/', pathname: '/', query: {}, push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }) }))`
- `react-i18next`: `jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key.split('.').pop() ?? key }) }))` — last key segment is returned; genre badges render as e.g. "adventure" in tests.
- styled-components: wrap in `<ThemeProvider theme={StyledTheme}>` from `src/store/context/StylesContext/Theme.tsx` — export name is `StyledTheme`
- No custom render wrapper yet; inline ThemeProvider is the pattern

## next/link behaviour in jsdom
`next/link` in Next 15 renders a real `<a>` element in jsdom (no special mock needed).
- `href` is set directly as a DOM attribute — queryable with `getAttribute('href')`
- For object hrefs like `{ pathname: '/login', query: { previous: '/foo' } }`, it resolves to `/login?previous=%2Ffoo`
- `styled(Link)` renders as a single `<a>`; legacy `<Link passHref><styled.a>` renders **two** nested `<a>` tags and fires `validateDOMNesting` console.error — the nested-anchor regression test catches this with `container.querySelectorAll('a a')`.

## Nested-anchor regression pattern (bugfix/link-nested-anchor)
The bug: `<Link passHref><styled.a>` in Next 15 produces `<a><a>` (invalid HTML). Fixed by converting `styled.a` to `styled(Link)`.
Regression guard: `expect(container.querySelectorAll('a a')).toHaveLength(0)` in components that render link CTAs.
Also assert: `querySelectorAll('a').length === expected_count` and `getAttribute('href') === expected_url`.

## Components with regression tests for this bug (as of 2026-06-25)
- `src/views/BookDetailPage/BookDetailCTA.tsx` — PrimaryButtonAnchor (/register) and LoginLink (/login) in unauth branch
- `src/views/AccountPage/components/BooksEmptyState.tsx` — PrimaryButton (/account?section=addBook)
- `src/views/BooksPage/BookCard.tsx` — CTAButton (/books/<id>)
- `src/views/BookDetailPage/index.tsx` — BreadcrumbLink (/books): NOT tested (too many heavy child deps: ModalContact/MUI/i18n/UserContext/useFetchBook; brittle test not worth it)

## Querying disabled buttons with aria-label
When `BookDetailCTA` disables the button, it also sets `aria-label="No disponible por ahora"` — the aria-label overrides the text content as the accessible name. Query by `{ name: /no disponible por ahora/i }`, not by the button's visible text "Pedir un ejemplar →", when copies=0.

## Pre-existing TypeScript errors (ignore in tests)
- `src/components/BookListItem.tsx` line 91 — TS2769 (Link href shape)
- `src/index.tsx` line 11 — TS2739 (MyAppProps missing fields)
Both pre-date all test work; `npx tsc --noEmit` exits 2 but test files add zero new errors.
