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

type SavedReviewer = Record<string, unknown>;

/** Mocks `GET .../reviewer/:id` with the given saved reviewer, and any save
 * to the register endpoint with a generic success response. */
const mockFetchWithReviewer = (saved: SavedReviewer): jest.Mock => jest.fn((url: string) => {
  if (url.startsWith(REVIEWER_URL)) {
    return Promise.resolve({ json: () => Promise.resolve({ reviewer: saved }) });
  }
  if (url === REGISTER_BLOG_URL) {
    return Promise.resolve({
      json: () => Promise.resolve({ success: true, message: 'Guardado', reviewer: saved }),
    });
  }
  throw new Error(`Unexpected fetch call: ${url}`);
});

/** Same as above with a saved (invalid) Amazon link. */
const mockFetch = (savedAmazonUrl: string): jest.Mock => mockFetchWithReviewer(buildReviewer(savedAmazonUrl));

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

// A saved reviewer that predates the TikTok/Podcast channels: the documents
// simply don't have those fields.
const REVIEWER_WITHOUT_NEW_CHANNELS = {
  author: user._id,
  genres: ['novela'],
  formats: ['epub'],
  description: 'Me gusta leer.',
};

const saveCalls = (): Array<[string, RequestInit]> => (
  (global.fetch as jest.Mock).mock.calls.filter(([url]) => url === REGISTER_BLOG_URL)
);

/** Waits for the saved reviewer to load (the description textarea is filled). */
const waitForReviewerLoaded = async (): Promise<void> => {
  await waitFor(() => expect(screen.getByLabelText('Cómo te gusta escribir tus reseñas'))
    .toHaveValue(REVIEWER_WITHOUT_NEW_CHANNELS.description));
};

describe('SpacesSection — channels list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetchWithReviewer(REVIEWER_WITHOUT_NEW_CHANNELS) as unknown as typeof fetch;
  });

  it('renders the 7 channels in the specified order', async () => {
    renderSection();
    await waitForReviewerLoaded();

    const switchNames = screen.getAllByRole('switch').map((toggle) => toggle.getAttribute('aria-label'));
    expect(switchNames).toEqual([
      'Activar Amazon',
      'Activar Goodreads',
      'Activar Instagram',
      'Activar TikTok',
      'Activar Booktube',
      'Activar Blog',
      'Activar Podcast',
    ]);
  });

  it.each([
    ['TikTok', 'tiktok', '@tuusuario', 'https://www.tiktok.com/@tuusuario'],
    ['Podcast', 'podcast', 'Nombre del podcast', 'https://open.spotify.com/show/…'],
  ])('the %s toggle is an accessible switch that reveals its fields with placeholders', async (label, key, namePlaceholder, urlPlaceholder) => {
    renderSection();
    await waitForReviewerLoaded();

    const toggle = screen.getByRole('switch', { name: `Activar ${label}` });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAttribute('aria-controls', `${key}-fields`);
    expect(screen.queryByPlaceholderText(urlPlaceholder)).not.toBeInTheDocument();

    // Keyboard: the switch is a native checkbox, so Space toggles it.
    toggle.focus();
    await userEvent.keyboard(' ');

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByPlaceholderText(namePlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(urlPlaceholder)).toBeInTheDocument();
  });
});

describe('SpacesSection — TikTok URL validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetchWithReviewer(REVIEWER_WITHOUT_NEW_CHANNELS) as unknown as typeof fetch;
  });

  const fillTikTok = async (url: string): Promise<HTMLElement> => {
    renderSection();
    await waitForReviewerLoaded();
    await userEvent.click(screen.getByRole('switch', { name: 'Activar TikTok' }));
    await userEvent.type(screen.getByPlaceholderText('@tuusuario'), '@lectora');
    const urlField = screen.getByPlaceholderText('https://www.tiktok.com/@tuusuario');
    await userEvent.type(urlField, url);
    return urlField;
  };

  it('shows the error on blur for a URL from another domain', async () => {
    await fillTikTok('https://www.instagram.com/lectora');
    await userEvent.tab();

    expect(screen.getByText('Este enlace no parece de TikTok.')).toBeInTheDocument();
  });

  it('blocks saving and focuses the field when the URL is not from TikTok', async () => {
    const urlField = await fillTikTok('https://www.instagram.com/lectora');

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(saveCalls()).toHaveLength(0);
    expect(screen.getByText('Este enlace no parece de TikTok.')).toBeInTheDocument();
    expect(urlField).toHaveFocus();
  });

  it('saves a URL typed without protocol in absolute form', async () => {
    await fillTikTok('tiktok.com/@lectora');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveCalls()).toHaveLength(1));
    const body = JSON.parse(saveCalls()[0][1].body as string);
    expect(body.tiktok.url).toBe('https://tiktok.com/@lectora');
  });

  it('clears the error when the channel is switched off', async () => {
    await fillTikTok('https://www.instagram.com/lectora');
    await userEvent.tab();
    expect(screen.getByText('Este enlace no parece de TikTok.')).toBeInTheDocument();
    expect(screen.getByText('Revisa el formulario, tienes errores.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('switch', { name: 'Activar TikTok' }));

    expect(screen.queryByText('Este enlace no parece de TikTok.')).not.toBeInTheDocument();
    expect(screen.queryByText('Revisa el formulario, tienes errores.')).not.toBeInTheDocument();
  });

  it('saves a valid TikTok channel', async () => {
    await fillTikTok('https://www.tiktok.com/@lectora');
    await userEvent.tab();
    expect(screen.queryByText('Este enlace no parece de TikTok.')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveCalls()).toHaveLength(1));
    const body = JSON.parse(saveCalls()[0][1].body as string);
    expect(body.tiktok).toEqual({ selected: true, name: '@lectora', url: 'https://www.tiktok.com/@lectora' });
  });
});

describe('SpacesSection — Podcast URL', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetchWithReviewer(REVIEWER_WITHOUT_NEW_CHANNELS) as unknown as typeof fetch;
  });

  it.each([
    'https://www.ivoox.com/podcast-entre-libros_sq_f11234_1.html',
    'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
  ])('accepts and saves %s', async (podcastUrl) => {
    renderSection();
    await waitForReviewerLoaded();

    await userEvent.click(screen.getByRole('switch', { name: 'Activar Podcast' }));
    await userEvent.type(screen.getByPlaceholderText('Nombre del podcast'), 'Entre libros');
    await userEvent.type(screen.getByPlaceholderText('https://open.spotify.com/show/…'), podcastUrl);
    await userEvent.tab();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveCalls()).toHaveLength(1));
    const body = JSON.parse(saveCalls()[0][1].body as string);
    expect(body.podcast).toEqual({ selected: true, name: 'Entre libros', url: podcastUrl });
    expect(screen.queryByText('Revisa el formulario, tienes errores.')).not.toBeInTheDocument();
  });
});

describe('SpacesSection — saved TikTok and Podcast channels', () => {
  const SAVED_TIKTOK = { name: '@lectora', url: 'https://www.tiktok.com/@lectora' };
  const SAVED_PODCAST = { name: 'Entre libros', url: 'https://www.ivoox.com/podcast-entre-libros_sq_f11234_1.html' };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetchWithReviewer({
      ...REVIEWER_WITHOUT_NEW_CHANNELS,
      tiktok: SAVED_TIKTOK,
      podcast: SAVED_PODCAST,
    }) as unknown as typeof fetch;
  });

  it('loads them switched on with their fields prefilled, and saves them back unchanged', async () => {
    renderSection();
    await waitForReviewerLoaded();

    expect(screen.getByRole('switch', { name: 'Activar TikTok' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('switch', { name: 'Activar Podcast' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByPlaceholderText('@tuusuario')).toHaveValue(SAVED_TIKTOK.name);
    expect(screen.getByPlaceholderText('https://www.tiktok.com/@tuusuario')).toHaveValue(SAVED_TIKTOK.url);
    expect(screen.getByPlaceholderText('Nombre del podcast')).toHaveValue(SAVED_PODCAST.name);
    expect(screen.getByPlaceholderText('https://open.spotify.com/show/…')).toHaveValue(SAVED_PODCAST.url);

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(saveCalls()).toHaveLength(1));
    const [, options] = saveCalls()[0];
    expect(options.method).toBe('put');
    const body = JSON.parse(options.body as string);
    expect(body.tiktok).toEqual({ selected: true, ...SAVED_TIKTOK });
    expect(body.podcast).toEqual({ selected: true, ...SAVED_PODCAST });
  });
});
