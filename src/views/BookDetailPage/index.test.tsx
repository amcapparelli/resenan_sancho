/* eslint-disable no-underscore-dangle */
/**
 * Tests for the book detail page as the owner of the copy-request flow.
 *
 * The page — not the modal — performs the POST, fires the analytics event, shows
 * the success toast and refetches the book so the availability count updates.
 * The refetch is the fragile part: it must fire after an order and never on mount,
 * where it would waste a request on data SSR already delivered.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import UserContext from '../../store/context/userContext/UserContext';
import { Book } from '../../interfaces/books';
import { useFetchBook } from '../../utils/customHooks';
import BookDetailPage from '.';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key.split('.').pop() ?? key }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ asPath: '/books/book-1', query: {}, push: jest.fn() }),
}));

jest.mock('react-ga4', () => ({
  __esModule: true,
  default: { event: jest.fn() },
}));

// Only the refetch hook is mocked: useOrderBook is the code under test here and
// talks to a mocked `fetch` instead.
jest.mock('../../utils/customHooks', () => ({
  useFetchBook: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
const ReactGA = require('react-ga4').default;

const useFetchBookMock = useFetchBook as jest.Mock;
const fetchBookMock = jest.fn();
const gaEventMock = ReactGA.event as jest.Mock;

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BOOK: Book = {
  _id: 'book-1',
  title: 'La sombra del viento',
  author: { name: 'Marina', lastName: 'Ruiz' },
  synopsis: 'Un chico encuentra un libro maldito.',
  genre: 'ADV',
  formats: ['papel'],
  cover: '',
  editorial: 'Independiente',
  pages: 300,
  copies: 3,
  freePromoAvailable: false,
};

const userContextValue = {
  isLogged: true,
  user: {
    _id: 'reviewer-1', token: 'token-abc', name: 'Lucía', lastName: 'Pérez',
  },
} as unknown as React.ContextType<typeof UserContext>;

/** Empty reducer state: the page falls back to the SSR book until a refetch lands. */
const EMPTY_FETCHED_BOOK = { _id: '' };

function renderPage({ strict = false } = {}) {
  const tree = (
    <ThemeProvider theme={StyledTheme}>
      <UserContext.Provider value={userContextValue}>
        <BookDetailPage book={BOOK} />
      </UserContext.Provider>
    </ThemeProvider>
  );

  return render(strict ? <React.StrictMode>{tree}</React.StrictMode> : tree);
}

/** Opens the modal and sends a message. */
async function orderACopy(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /pedir un ejemplar/i }));
  await user.click(screen.getByLabelText(/Al enviar el mensaje le facilitaremos tu email/));
  await user.type(screen.getByLabelText('Tu mensaje'), 'Hola Marina');
  await user.click(screen.getByRole('button', { name: /enviar mensaje/i }));
}

beforeEach(() => {
  jest.clearAllMocks();
  useFetchBookMock.mockReturnValue([EMPTY_FETCHED_BOOK, fetchBookMock]);
  global.fetch = jest.fn().mockResolvedValue({ json: () => Promise.resolve({ success: true }) });
});

afterEach(() => {
  delete global.fetch;
});

// ─── Refetch after an order ──────────────────────────────────────────────────

describe('BookDetailPage — refetching the book', () => {
  it('does not refetch on mount: SSR already provided the book', () => {
    renderPage();
    expect(fetchBookMock).not.toHaveBeenCalled();
  });

  it('does not refetch on mount under StrictMode double-invoked effects', () => {
    // REGRESSION: the guard used to be a `didMount` ref, which StrictMode's
    // setup → cleanup → setup cycle defeats (the ref is never reset), so the page
    // fired a spurious fetch on mount in development.
    renderPage({ strict: true });
    expect(fetchBookMock).not.toHaveBeenCalled();
  });

  it('does not refetch when the modal is closed without ordering', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /pedir un ejemplar/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(fetchBookMock).not.toHaveBeenCalled();
  });

  it('refetches the book after a successful order', async () => {
    const user = userEvent.setup();
    renderPage();

    await orderACopy(user);

    await waitFor(() => expect(fetchBookMock).toHaveBeenCalledWith('book-1'));
    expect(fetchBookMock).toHaveBeenCalledTimes(1);
  });

  it('refetches again on a second order within the same visit', async () => {
    // REGRESSION: the effect is keyed on a counter and not on a boolean flag.
    // With a flag, the second order leaves the value at `true`, the effect never
    // re-runs and the copy count on screen goes stale.
    const user = userEvent.setup();
    renderPage();

    await orderACopy(user);
    await waitFor(() => expect(fetchBookMock).toHaveBeenCalledTimes(1));
    // The modal only clears its form once the exit transition ends, so reopening
    // before that would type into the previous draft.
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await orderACopy(user);

    await waitFor(() => expect(fetchBookMock).toHaveBeenCalledTimes(2));
    expect(fetchBookMock).toHaveBeenNthCalledWith(2, 'book-1');
  });
});

// ─── Success feedback ────────────────────────────────────────────────────────

describe('BookDetailPage — after a successful order', () => {
  it('closes the modal and announces "Mensaje enviado"', async () => {
    const user = userEvent.setup();
    renderPage();

    await orderACopy(user);

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('status')).toHaveTextContent('Mensaje enviado');
  });

  it('reports the order to analytics with the book title and the reviewer name', async () => {
    const user = userEvent.setup();
    renderPage();

    await orderACopy(user);

    await waitFor(() => expect(gaEventMock).toHaveBeenCalledWith({
      category: 'Ejemplar pedido',
      action: 'Libro pedido: La sombra del viento, reseñador: Lucía Pérez',
    }));
  });
});

// ─── Failed order ────────────────────────────────────────────────────────────

describe('BookDetailPage — when the order fails', () => {
  it('keeps the modal open, shows no toast and does not refetch', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: false, message: 'Ya no quedan ejemplares.' }),
    });
    renderPage();

    await orderACopy(user);

    // The server explanation reaches the user because useOrderBook rejects with a
    // SubmitError; the page's toast and refetch stay out of it.
    expect(await screen.findByText('Ya no quedan ejemplares.')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByText('Mensaje enviado')).not.toBeInTheDocument();
    expect(fetchBookMock).not.toHaveBeenCalled();
    expect(gaEventMock).not.toHaveBeenCalled();
  });
});
