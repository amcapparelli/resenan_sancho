/**
 * What must not regress in the country field:
 *  - the user reads Spanish country names, but the profile stores the ISO code;
 *  - a profile whose `country` was never migrated ("Spain") must not blow up nor
 *    render a silently blank select: it falls back to the placeholder and asks
 *    for the missing data.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../store/context/StylesContext/Theme';
import esCommon from '../../../../public/static/locales/es/common.json';
import CountrySelect from './CountrySelect';

// The Spanish copy IS what these assertions are about, so `t` resolves against
// the real bundle instead of a hand-copied dictionary: renaming or deleting a
// key must fail here, not ship a raw "components.countriesSelector.note" to
// production. Same file that `src/i18n.ts` loads.
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

const { placeholder: PLACEHOLDER, note: NOTE, emptyNote: EMPTY_NOTE } = (
  esCommon.components.countriesSelector
);

const renderCountrySelect = (value: string, onChange = jest.fn()) => {
  render(
    <ThemeProvider theme={StyledTheme}>
      <CountrySelect label="País" value={value} onChange={onChange} />
    </ThemeProvider>,
  );
  return onChange;
};

const getSelect = (): HTMLSelectElement => screen.getByLabelText('País') as HTMLSelectElement;

// `getByRole` is typed as HTMLElement; the cast is what gives access to
// `selected`, which is how the rendered selection is asserted.
const getOption = (name: string): HTMLOptionElement => (
  screen.getByRole('option', { name }) as HTMLOptionElement
);

describe('CountrySelect', () => {
  it('lists countries by their Spanish name, never by their code', () => {
    renderCountrySelect('');

    expect(screen.getByRole('option', { name: 'España' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'ES' })).not.toBeInTheDocument();
  });

  it('reports the ISO code when a country is picked', async () => {
    const onChange = renderCountrySelect('');

    await userEvent.selectOptions(getSelect(), screen.getByRole('option', { name: 'España' }));

    expect(onChange).toHaveBeenCalledWith('ES');
  });

  it('shows the country matching the stored ISO code', () => {
    renderCountrySelect('ES');

    expect(getSelect().value).toBe('ES');
    expect(getOption('España').selected).toBe(true);
  });

  it('explains why the country is asked for once one is selected', () => {
    renderCountrySelect('ES');

    expect(screen.getByText(NOTE)).toBeInTheDocument();
    expect(screen.queryByText(EMPTY_NOTE)).not.toBeInTheDocument();
  });

  it('falls back to the placeholder for a legacy value that maps to no code', () => {
    renderCountrySelect('Spain');

    expect(getSelect().value).toBe('');
    expect(getOption(PLACEHOLDER).selected).toBe(true);
    expect(screen.getByText(EMPTY_NOTE)).toBeInTheDocument();
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });

  it('asks for the country when the profile has none', () => {
    renderCountrySelect('');

    expect(getSelect().value).toBe('');
    expect(getOption(PLACEHOLDER).selected).toBe(true);
    expect(screen.getByText(EMPTY_NOTE)).toBeInTheDocument();
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });

  it('keeps the placeholder selectable: the country is optional', async () => {
    const onChange = renderCountrySelect('ES');

    expect(getOption(PLACEHOLDER)).not.toBeDisabled();

    // Clearing the field has to reach the form as an empty value, not be
    // swallowed: the country is optional and must stay removable.
    await userEvent.selectOptions(getSelect(), getOption(PLACEHOLDER));

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('describes the field with its note, so the reason is announced', () => {
    renderCountrySelect('');

    expect(getSelect()).toHaveAccessibleDescription(EMPTY_NOTE);
  });
});
