/* eslint-disable no-underscore-dangle */
/**
 * View-level integration test for the promote modal's lifecycle inside
 * "Mis libros".
 *
 * Bug fixed: `<PromoteServicesModal>` was mounted without a `key`, so the same
 * instance was reused for every book. After claiming the free copies on book A,
 * the persisted claim result kept `eligibility.freePromoAvailable` false, and
 * book B — never promoted — rendered "Ya usaste los 2 gratuitos de este libro"
 * instead of its CTA.
 *
 * This has to live here, not in the modal's own suite: the fix is the
 * `key={bookSelected._id}` that THIS component passes. A test that renders the
 * modal directly has to supply the key itself, so it proves that React remounts
 * on a key change — which was never in doubt — and stays green if production
 * drops the prop.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../store/context/StylesContext/Theme';
import UserContext from '../../../store/context/userContext/UserContext';
import { Book } from '../../../interfaces/books';
import MyBooksSection from './MyBooksSection';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('.').pop() ?? key,
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Keeps Stripe and the rest of the shared component barrel out of this suite:
// the flow under test never reaches the payment step.
jest.mock('../../../components', () => ({
  PaymentCheckout: jest.fn((): JSX.Element => null),
}));

const buildBook = (id: string, title: string): Book => ({
  _id: id,
  editorial: '',
  title,
  formats: ['papel'],
  freePromoAvailable: true,
  genre: 'ADV',
  author: { name: 'Ana', lastName: 'Ruiz' },
  cover: '',
  synopsis: '',
  pages: 200,
  copies: 3,
});

const BOOKS = [buildBook('book-a', 'Libro A'), buildBook('book-b', 'Libro B')];

const userContextValue = {
  user: { _id: 'user-1', token: 'token', emailAuthorListStatus: 'unsubscribed' },
  setUserLogged: jest.fn(),
} as unknown as React.ContextType<typeof UserContext>;

const renderSection = () => render(
  <ThemeProvider theme={StyledTheme}>
    <UserContext.Provider value={userContextValue}>
      <MyBooksSection />
    </UserContext.Provider>
  </ThemeProvider>,
);

/** Rows render in fixture order, so the index identifies the book. */
const promoteButtonAt = (index: number) => screen.getAllByRole('button', { name: 'Promocionar' })[index];

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn((url: string, options: { method?: string } = {}) => {
    // PUT /promotions/:bookId → claiming the free copies.
    if (options.method === 'put') {
      return Promise.resolve({
        json: () => Promise.resolve({ success: true, message: 'Promoción activada' }),
      });
    }
    // GET /mybooks/:userId → the author's book list, in the shape the
    // USER_BOOKS_LIST_LOAD reducer expects.
    return Promise.resolve({ json: () => Promise.resolve({ books: BOOKS }) });
  }) as unknown as typeof fetch;
});

describe('MyBooksSection — promote modal per book', () => {
  it('keeps the free CTA on a second book after claiming it on the first', async () => {
    renderSection();
    await screen.findByRole('heading', { name: 'Libro A' });

    // Book A: open, claim the free copies, close.
    await userEvent.click(promoteButtonAt(0));
    await userEvent.click(await screen.findByRole('button', { name: /^Activar gratis para/ }));
    await screen.findByText('Promoción activada');
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    // While the dialog is open MUI marks the rest of the app aria-hidden, so
    // the list is only queryable again once it has actually closed.
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Promocionar' })).toHaveLength(2);
    });

    // Book B has never been promoted: it must still offer its free copies.
    await userEvent.click(promoteButtonAt(1));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^Activar gratis para/ })).toBeInTheDocument();
    });
    expect(screen.queryByText(/Ya usaste los 2 gratuitos/)).not.toBeInTheDocument();
  });
});
