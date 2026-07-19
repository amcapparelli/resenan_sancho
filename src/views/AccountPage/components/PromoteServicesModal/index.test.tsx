/* eslint-disable no-underscore-dangle */
/**
 * Behaviour that must not regress in the promote modal:
 *  - every *available* service is rendered, hireable or not (fair comparison);
 *  - `available` and `enabled` stay two different things: the first hides the
 *    service, the second only disables it;
 *  - an unavailable service exposes its explanation as text, never as a
 *    disabled button whose accessible name is still the CTA;
 *  - prices are formatted from `priceCents`, never written in the copy;
 *  - the exact contract that reaches the payments component;
 *  - state never leaks from one book to the next.
 */
import React from 'react';
import {
  act, render, screen, waitFor, within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../../store/context/StylesContext/Theme';
import UserContext from '../../../../store/context/userContext/UserContext';
import { Book } from '../../../../interfaces/books';
import formatPriceCents from '../../../../utils/formatPriceCents';
import { PaymentCheckout } from '../../../../components';
import getStripe from './stripeLoader';
import PromoteServicesModal from '.';
import promotionServices from './catalog';
import { PromotionService } from './types';

// The payment component is the boundary under test: we assert what it receives,
// not what Stripe does with it.
jest.mock('../../../../components', () => ({
  // Explicit return type: with strictNullChecks off, a bare `null` return would
  // be inferred as implicit `any` and trip noImplicitAny.
  PaymentCheckout: jest.fn((): JSX.Element => null),
}));

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children: React.ReactNode }): React.ReactNode => children,
}));

jest.mock('./stripeLoader', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ fake: 'stripe' })),
  resetStripe: jest.fn(),
}));

const paymentCheckoutMock = PaymentCheckout as unknown as jest.Mock;
const getStripeMock = getStripe as jest.Mock;

const lastCheckoutProps = () => paymentCheckoutMock.mock.calls.at(-1)[0];

const book: Book = {
  _id: 'book-1',
  editorial: '',
  title: 'La sombra del viento',
  formats: ['papel', 'epub'],
  freePromoAvailable: true,
  genre: 'ADV',
  author: { name: 'Ana', lastName: 'Ruiz' },
  cover: 'https://example.com/cover.jpg',
  synopsis: '',
  pages: 300,
  copies: 1,
};

const userContextValue = {
  user: { _id: 'user-1', token: 'token' },
  setUserLogged: jest.fn(),
} as unknown as React.ContextType<typeof UserContext>;

/** What the user can actually see: the modal drops `available: false` services. */
const visibleCatalogue = promotionServices.filter((service) => service.available);

const renderModalWith = (
  services: PromotionService[],
  bookOverrides: Partial<Book> = {},
) => render(
  <ThemeProvider theme={StyledTheme}>
    <UserContext.Provider value={userContextValue}>
      <PromoteServicesModal
        open
        book={{ ...book, ...bookOverrides }}
        services={services}
        onClose={jest.fn()}
      />
    </UserContext.Provider>
  </ThemeProvider>,
);

const renderModal = (bookOverrides: Partial<Book> = {}) => (
  renderModalWith(promotionServices, bookOverrides)
);

const cardFor = (name: string) => screen.getByRole('heading', { name }).closest('article');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PromoteServicesModal', () => {
  it('renders every available service in the catalogue, hireable or not', () => {
    renderModal();
    expect(screen.getAllByRole('article')).toHaveLength(visibleCatalogue.length);
  });

  it('uses the singular form when the book has a single copy', () => {
    renderModal({ copies: 1 });
    expect(screen.getByText('1 ejemplar disponible')).toBeInTheDocument();
  });

  // Driven by the catalogue rather than by one literal: a hardcoded price in
  // PriceTag would satisfy a single expectation but not every service at once.
  it.each(visibleCatalogue.filter((service) => !service.free))(
    'derives the price of "$name" from its priceCents',
    ({ name, priceCents }) => {
      renderModal();
      // es-ES puts a non-breaking space before the symbol; RTL normalises the
      // element's text to plain spaces, so the expectation has to match.
      const expected = formatPriceCents(priceCents).replace(/\s/g, ' ');
      expect(within(cardFor(name)).getByText(expected)).toBeInTheDocument();
    },
  );

  it('shows "Gratis" instead of an amount for the free service', () => {
    renderModal();
    expect(within(cardFor('2 ejemplares gratis')).getByText('Gratis')).toBeInTheDocument();
  });

  it('replaces the CTA with an explanation when the free copies were already used', () => {
    renderModal({ freePromoAvailable: false });
    const card = within(cardFor('2 ejemplares gratis'));
    expect(card.queryByRole('button', { name: /Contratar/ })).not.toBeInTheDocument();
    expect(card.getByText(/Ya usaste los 2 gratuitos/)).toBeInTheDocument();
  });

  it('blocks the boost service when the book is not available on paper', () => {
    renderModal({ formats: ['epub'] });
    const card = within(cardFor('Acelera tu libro'));
    expect(card.getByText(/Tu libro no está en papel/)).toBeInTheDocument();
    // The status badge takes over the marketing one: only one badge band fits.
    expect(card.queryByText('Máxima difusión')).not.toBeInTheDocument();
  });
});

/**
 * `available` and `enabled` are two different switches and the day someone
 * collapses them into one, these tests are what stops it:
 *  - `available: false` → the service does not exist for the reader;
 *  - `enabled: false`   → it exists, on screen, disabled and explained.
 */
describe('PromoteServicesModal — available is not enabled', () => {
  const baseService = promotionServices.find((service) => service.key === 'copies5');

  const serviceWith = (overrides: Partial<PromotionService>): PromotionService => ({
    ...baseService,
    ...overrides,
  });

  const hiddenService = serviceWith({
    key: 'featuredWeek',
    available: false,
    name: 'Servicio retirado',
    ctaLabel: 'Contratar retirado',
  });

  it('does not render a service marked as unavailable', () => {
    renderModalWith([promotionServices[0], hiddenService]);

    expect(screen.queryByRole('heading', { name: 'Servicio retirado' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Contratar retirado/ })).not.toBeInTheDocument();
    // The disclosure has its own accessible name, so it would survive a filter
    // that only hid the card body.
    expect(
      screen.queryByRole('button', { name: 'Cómo funciona: Servicio retirado' }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });

  it('renders an available but globally disabled service, without a CTA', () => {
    const disabledService = serviceWith({
      key: 'featuredWeek',
      available: true,
      enabled: false,
      name: 'Servicio en preparación',
      ctaLabel: 'Contratar preparación',
    });

    renderModalWith([disabledService]);

    const card = within(cardFor('Servicio en preparación'));
    expect(card.getByText(/Todavía no está disponible/)).toBeInTheDocument();
    expect(card.getByText('Próximamente')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^Contratar preparación/ }),
    ).not.toBeInTheDocument();
  });

  it('falls back to the empty catalogue state when every service is unavailable', () => {
    renderModalWith(promotionServices.map((service) => ({ ...service, available: false })));

    expect(screen.getByRole('heading', { name: /no hay servicios disponibles/i })).toBeInTheDocument();
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });
});

// The values below are the contract with the payments backend, which maps
// `chosenPromo` to the copies and the price it charges. They must not drift.
describe('PromoteServicesModal — payment contract', () => {
  it('sends chosenPromo 2 and 990 cents for "Añade 5 ejemplares"', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: /^Añadir 5 ejemplares para/ }));

    await waitFor(() => expect(paymentCheckoutMock).toHaveBeenCalled());
    expect(lastCheckoutProps()).toEqual(expect.objectContaining({
      chosenPromo: 2,
      amountCents: 990,
      bookId: 'book-1',
      bookTitle: 'La sombra del viento',
    }));
  });

  it('sends chosenPromo 3 and 6990 cents for "Acelera tu libro"', async () => {
    renderModal();
    await userEvent.click(screen.getByRole('button', { name: /^Acelerar mi libro para/ }));

    await waitFor(() => expect(paymentCheckoutMock).toHaveBeenCalled());
    expect(lastCheckoutProps()).toEqual(expect.objectContaining({
      chosenPromo: 3,
      amountCents: 6990,
    }));
  });

  it('does not open the payment component before a CTA is pressed', () => {
    renderModal();
    expect(paymentCheckoutMock).not.toHaveBeenCalled();
  });

  it('opens the checkout under StrictMode double-invoked effects', async () => {
    // REGRESSION: the isMounted ref was only set at creation, so StrictMode's
    // setup → cleanup → setup left it false and the payment never opened in dev.
    render(
      <React.StrictMode>
        <ThemeProvider theme={StyledTheme}>
          <UserContext.Provider value={userContextValue}>
            <PromoteServicesModal
              open
              book={book}
              services={promotionServices}
              onClose={jest.fn()}
            />
          </UserContext.Provider>
        </ThemeProvider>
      </React.StrictMode>,
    );

    await userEvent.click(screen.getByRole('button', { name: /^Añadir 5 ejemplares para/ }));

    await waitFor(() => expect(paymentCheckoutMock).toHaveBeenCalled());
    expect(lastCheckoutProps()).toEqual(expect.objectContaining({ chosenPromo: 2 }));
  });
});

/**
 * Closing the dialog does NOT unmount this component (MyBooksSection keeps the
 * instance alive while a book is selected), so everything below is about state
 * surviving a hide/show cycle. Leaking across *books* is guarded one level up,
 * in MyBooksSection.test.tsx, where the `key` that fixes it actually lives.
 */
describe('PromoteServicesModal — state does not survive a close', () => {
  const renderWithOpen = (isOpen: boolean) => (
    <ThemeProvider theme={StyledTheme}>
      <UserContext.Provider value={userContextValue}>
        <PromoteServicesModal
          open={isOpen}
          book={book}
          services={promotionServices}
          onClose={jest.fn()}
        />
      </UserContext.Provider>
    </ThemeProvider>
  );

  const mockClaim = (success: boolean, message: string) => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ success, message }),
    })) as unknown as typeof fetch;
  };

  it('drops a pending checkout when the modal is closed', async () => {
    // REGRESSION: reopening the modal used to pop the card modal on its own,
    // because paidService survived the close.
    const { rerender } = render(renderWithOpen(true));
    await userEvent.click(screen.getByRole('button', { name: /^Añadir 5 ejemplares para/ }));
    await waitFor(() => expect(paymentCheckoutMock).toHaveBeenCalled());

    rerender(renderWithOpen(false));
    paymentCheckoutMock.mockClear();
    rerender(renderWithOpen(true));

    expect(paymentCheckoutMock).not.toHaveBeenCalled();
  });

  it('does not open the checkout if Stripe resolves after the modal was closed', async () => {
    // REGRESSION (race): Stripe.js takes seconds to download. Closing the modal
    // mid-download used to let the late promise write paidService, and the card
    // modal appeared unprompted on the next open.
    let resolveStripe: (value: unknown) => void;
    getStripeMock.mockImplementationOnce(() => new Promise((resolve) => {
      resolveStripe = resolve;
    }));

    const { rerender } = render(renderWithOpen(true));
    await userEvent.click(screen.getByRole('button', { name: /^Añadir 5 ejemplares para/ }));

    rerender(renderWithOpen(false));
    await act(async () => {
      resolveStripe({ fake: 'stripe' });
    });
    rerender(renderWithOpen(true));

    expect(paymentCheckoutMock).not.toHaveBeenCalled();
  });

  it('clears a failed claim so it is not shown again on reopen', async () => {
    mockClaim(false, 'No se pudo activar la promoción');

    const { rerender } = render(renderWithOpen(true));
    await userEvent.click(screen.getByRole('button', { name: /^Activar gratis para/ }));
    await screen.findByText('No se pudo activar la promoción');

    rerender(renderWithOpen(false));
    rerender(renderWithOpen(true));

    expect(screen.queryByText('No se pudo activar la promoción')).not.toBeInTheDocument();
    // The claim failed, so the offer is still on the table.
    expect(screen.getByRole('button', { name: /^Activar gratis para/ })).toBeInTheDocument();
  });

  it('keeps a successful claim on reopen, so the free CTA stays hidden', async () => {
    // The `book` prop still says freePromoAvailable: true on reopen (it is only
    // refreshed when "Promocionar" is pressed again), so this persisted success
    // is the only thing standing between the user and a second free claim.
    mockClaim(true, 'Promoción activada');

    const { rerender } = render(renderWithOpen(true));
    await userEvent.click(screen.getByRole('button', { name: /^Activar gratis para/ }));
    await screen.findByText('Promoción activada');

    rerender(renderWithOpen(false));
    rerender(renderWithOpen(true));

    expect(screen.queryByRole('button', { name: /^Activar gratis para/ })).not.toBeInTheDocument();
    expect(
      within(cardFor('2 ejemplares gratis')).getByText(/Ya usaste los 2 gratuitos/),
    ).toBeInTheDocument();
  });
});
