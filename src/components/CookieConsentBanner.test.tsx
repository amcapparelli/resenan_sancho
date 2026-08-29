import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { StyledTheme } from '../store/context/StylesContext/Theme';
import * as consent from '../utils/analytics/consent';
import CookieConsentBanner from './CookieConsentBanner';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key.split('.').pop() ?? key }),
}));

jest.mock('react-ga4', () => ({
  __esModule: true,
  default: { gtag: jest.fn() },
}));

jest.mock('../utils/analytics/consent', () => ({
  ...jest.requireActual('../utils/analytics/consent'),
  getStoredConsent: jest.fn(),
  storeConsent: jest.fn(),
  updateConsent: jest.fn(),
}));

const mockedConsent = consent as jest.Mocked<typeof consent>;

const renderBanner = () => render(
  <ThemeProvider theme={StyledTheme}>
    <CookieConsentBanner />
  </ThemeProvider>,
);

describe('CookieConsentBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the banner when there is no stored consent', () => {
    mockedConsent.getStoredConsent.mockReturnValue(null);

    renderBanner();

    expect(screen.getByRole('region', { name: 'title' })).toBeInTheDocument();
  });

  it('does not show the banner when consent was already stored', () => {
    mockedConsent.getStoredConsent.mockReturnValue('granted');

    renderBanner();

    expect(screen.queryByRole('region', { name: 'title' })).not.toBeInTheDocument();
  });

  it('accepting updates and stores consent, then hides the banner', async () => {
    mockedConsent.getStoredConsent.mockReturnValue(null);
    const user = userEvent.setup();

    renderBanner();
    await user.click(screen.getByRole('button', { name: 'accept' }));

    expect(mockedConsent.updateConsent).toHaveBeenCalledWith('granted');
    expect(mockedConsent.storeConsent).toHaveBeenCalledWith('granted');
    expect(screen.queryByRole('region', { name: 'title' })).not.toBeInTheDocument();
  });

  it('declining updates and stores consent, then hides the banner', async () => {
    mockedConsent.getStoredConsent.mockReturnValue(null);
    const user = userEvent.setup();

    renderBanner();
    await user.click(screen.getByRole('button', { name: 'decline' }));

    expect(mockedConsent.updateConsent).toHaveBeenCalledWith('denied');
    expect(mockedConsent.storeConsent).toHaveBeenCalledWith('denied');
    expect(screen.queryByRole('region', { name: 'title' })).not.toBeInTheDocument();
  });
});
