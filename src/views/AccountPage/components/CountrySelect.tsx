import React from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, getCountryName } from '../../../utils/constants/countries';
import AccountSelect from './AccountSelect';

interface CountrySelectProps {
  label: string;
  // ISO 3166-1 alpha-2 code, e.g. "ES". Legacy profiles may still hold a free
  // text name ("Spain"); those fall back to the placeholder.
  value: string;
  onChange: (isoCode: string) => void;
  className?: string;
}

// The option list is static, so it is mapped once at module load instead of on
// every render of the profile form.
const COUNTRY_OPTIONS = COUNTRIES.map(({ isoCode, nameEs }) => ({
  value: isoCode,
  label: nameEs,
}));

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  value,
  onChange,
  className,
}) => {
  const { t } = useTranslation();

  // A value that maps to no known code (not migrated yet, or a typo) would make
  // the select render blank with no explanation. Treat it as empty so the user
  // sees the placeholder plus the note asking to pick a country.
  const selectedIsoCode = getCountryName(value) ? value : '';

  return (
    <AccountSelect
      className={className}
      label={label}
      name="country"
      value={selectedIsoCode}
      options={COUNTRY_OPTIONS}
      onChange={onChange}
      placeholder={t('components.countriesSelector.placeholder')}
      note={selectedIsoCode
        ? t('components.countriesSelector.note')
        : t('components.countriesSelector.emptyNote')}
    />
  );
};

export default CountrySelect;
