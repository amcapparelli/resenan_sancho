/**
 * Regression: a profile whose `country` was never migrated to an ISO code.
 *
 * The select sanitises the legacy value for rendering only, so the form state
 * kept holding `country: "Spain"`. Saving any other field (a surname typo, say)
 * POSTed that legacy value to an API that now validates `/^[A-Z]{2}$/`, so the
 * whole update was rejected and the user lost the rest of their edit too.
 *
 * The fix normalises at load time, and drops the key entirely (`undefined`)
 * instead of blanking it, so the API leaves the stored field alone.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../store/context/StylesContext/Theme';
import UserContext from '../../../store/context/userContext/UserContext';
import esCommon from '../../../../public/static/locales/es/common.json';
import ProfileSection from './ProfileSection';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string): string => {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const bundle = require('../../../../public/static/locales/es/common.json');
      const value = key
        .split('.')
        .reduce<unknown>((node, segment) => (node as Record<string, unknown>)?.[segment], bundle);
      return typeof value === 'string' ? value : key;
    },
  }),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const { emptyNote: EMPTY_NOTE } = esCommon.components.countriesSelector;

const buildUser = (country: string) => ({
  _id: 'user-1',
  token: 'token',
  name: 'Ana',
  lastName: 'Ruiz',
  email: 'ana@example.com',
  country,
});

const renderSection = (country: string) => {
  const contextValue = {
    user: buildUser(country),
    setUserLogged: jest.fn(),
  } as unknown as React.ContextType<typeof UserContext>;

  render(
    <ThemeProvider theme={StyledTheme}>
      <UserContext.Provider value={contextValue}>
        <ProfileSection />
      </UserContext.Provider>
    </ThemeProvider>,
  );
};

const save = async (): Promise<void> => {
  await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }));
};

/** The body actually sent to POST /update, parsed back into an object. */
const lastRequestBody = (): Record<string, unknown> => {
  const [, options] = (global.fetch as jest.Mock).mock.calls.at(-1);
  return JSON.parse(options.body);
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({ success: true, message: 'updated', user: buildUser('ES') }),
  })) as unknown as typeof fetch;
});

describe('ProfileSection — country migration', () => {
  it('never sends a legacy country value back to the API', async () => {
    renderSection('Spain');

    await userEvent.type(screen.getByLabelText('Apellido'), 'z');
    await save();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const body = lastRequestBody();
    expect(body).not.toHaveProperty('country');
    expect(body.lastName).toBe('Ruizz');
  });

  it('asks the user for the missing country instead of failing silently', () => {
    renderSection('Spain');

    expect(screen.getByText(EMPTY_NOTE)).toBeInTheDocument();
  });

  it('keeps a valid ISO country untouched when saving', async () => {
    renderSection('ES');

    expect(screen.queryByText(EMPTY_NOTE)).not.toBeInTheDocument();

    await save();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(lastRequestBody().country).toBe('ES');
  });

  it('sends the ISO code, not the Spanish name, for a newly picked country', async () => {
    renderSection('Spain');

    await userEvent.selectOptions(screen.getByLabelText('País'), 'MX');
    await save();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(lastRequestBody().country).toBe('MX');
  });
});
