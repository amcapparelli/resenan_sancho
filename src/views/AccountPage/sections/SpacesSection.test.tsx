/**
 * Regression: a saved Amazon link that predates the profile-URL validation
 * shows a non-blocking warning on load. Blurring the field without actually
 * changing its value used to escalate that warning into a blocking error —
 * see docs/amazon-profile-link-spec.md ("Si la persona edita el campo, pasa
 * a aplicarse la validación normal").
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../store/context/StylesContext/Theme';
import UserContext from '../../../store/context/userContext/UserContext';
import { reviewer as REVIEWER_URL, registerBlog as REGISTER_BLOG_URL } from '../../../config/routes';
import SpacesSection from './SpacesSection';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string): string => key }),
}));

const PRODUCT_URL = 'https://www.amazon.es/dp/B08XYZ1234';
const ACCOUNT_URL = 'https://www.amazon.es/gp/css/homepage.html';

const user = {
  _id: 'user-1',
  token: 'token',
  name: 'Ana',
  lastName: 'Ruiz',
  email: 'ana@example.com',
};

const buildReviewer = (amazonUrl: string) => ({
  author: user._id,
  genres: ['novela'],
  formats: ['epub'],
  description: 'Me gusta leer.',
  amazon: { url: amazonUrl, name: 'Mi perfil' },
});

const renderSection = (): void => {
  const contextValue = {
    user,
    setUserLogged: jest.fn(),
  } as unknown as React.ContextType<typeof UserContext>;

  render(
    <ThemeProvider theme={StyledTheme}>
      <UserContext.Provider value={contextValue}>
        <SpacesSection />
      </UserContext.Provider>
    </ThemeProvider>,
  );
};

/** Mocks `GET .../reviewer/:id` with a saved (invalid) Amazon link, and any
 * `PUT` to the save endpoint with a generic success response. */
const mockFetch = (savedAmazonUrl: string): jest.Mock => jest.fn((url: string) => {
  if (url.startsWith(REVIEWER_URL)) {
    return Promise.resolve({ json: () => Promise.resolve({ reviewer: buildReviewer(savedAmazonUrl) }) });
  }
  if (url === REGISTER_BLOG_URL) {
    return Promise.resolve({
      json: () => Promise.resolve({ success: true, message: 'Guardado', reviewer: buildReviewer(savedAmazonUrl) }),
    });
  }
  throw new Error(`Unexpected fetch call: ${url}`);
});

const putCallsCount = (): number => (
  (global.fetch as jest.Mock).mock.calls.filter(([url, options]) => options?.method === 'put').length
);

describe('SpacesSection — Amazon URL warning vs. blocking error', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a non-blocking warning for a saved link that is not a profile URL', async () => {
    global.fetch = mockFetch(PRODUCT_URL) as unknown as typeof fetch;
    renderSection();

    expect(await screen.findByText(/Revisa este enlace/)).toBeInTheDocument();
  });

  it('keeps the warning (does not escalate to an error) on blur without editing the field', async () => {
    global.fetch = mockFetch(PRODUCT_URL) as unknown as typeof fetch;
    renderSection();

    const urlField = await screen.findByLabelText('URL');
    await waitFor(() => expect(screen.getByText(/Revisa este enlace/)).toBeInTheDocument());

    await userEvent.click(urlField);
    await userEvent.tab();

    expect(screen.getByText(/Revisa este enlace/)).toBeInTheDocument();
    expect(screen.queryByText('Este es el enlace de un producto, no de tu perfil. Necesitamos el que enseña tus reseñas.'))
      .not.toBeInTheDocument();
  });

  it('switches to a blocking error once the value is actually edited', async () => {
    global.fetch = mockFetch(PRODUCT_URL) as unknown as typeof fetch;
    renderSection();

    const urlField = await screen.findByLabelText('URL');
    await waitFor(() => expect(screen.getByText(/Revisa este enlace/)).toBeInTheDocument());

    await userEvent.clear(urlField);
    await userEvent.type(urlField, ACCOUNT_URL);
    await userEvent.tab();

    expect(screen.queryByText(/Revisa este enlace/)).not.toBeInTheDocument();
    expect(await screen.findByText(
      'Este es el enlace de tu cuenta privada: nadie más puede verlo. Necesitamos tu perfil público.',
    )).toBeInTheDocument();
  });

  it('blocks saving while the Amazon URL has a blocking error', async () => {
    global.fetch = mockFetch(PRODUCT_URL) as unknown as typeof fetch;
    renderSection();

    const urlField = await screen.findByLabelText('URL');
    await waitFor(() => expect(screen.getByText(/Revisa este enlace/)).toBeInTheDocument());

    await userEvent.clear(urlField);
    await userEvent.type(urlField, ACCOUNT_URL);
    await userEvent.tab();
    await screen.findByText('Este es el enlace de tu cuenta privada: nadie más puede verlo. Necesitamos tu perfil público.');

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(putCallsCount()).toBe(0);
    expect(screen.getByText('Este es el enlace de tu cuenta privada: nadie más puede verlo. Necesitamos tu perfil público.'))
      .toBeInTheDocument();
  });
});
