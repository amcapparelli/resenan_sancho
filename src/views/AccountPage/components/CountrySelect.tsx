import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { countriesListLoad } from '../../../store/reducers';
import { fieldBase } from './styles';
import { FieldWrapper, FieldLabel, FieldNote } from './AccountField';

// Chevron SVG encoded as a CSS background-image (terracotta stroke), matching
// the select style used across the redesigned pages (books-spec).
const CHEVRON_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14'%3E%3Cpolyline points='2%2C4 7%2C10 12%2C4' fill='none' stroke='%23C75B22' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%2F%3E%3C%2Fsvg%3E")`;

interface CountrySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  note?: string;
  className?: string;
}

const initialState = { countries: [] as string[] };

const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  value,
  onChange,
  note,
  className,
}) => {
  const [state, dispatch] = useReducer(countriesListLoad, initialState);

  useEffect(() => {
    const listCountries = async (): Promise<void> => {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
      const countries = await response.json();
      dispatch({ type: 'COUNTRIES_LIST_LOAD', payload: { countries } });
    };
    listCountries();
  }, []);

  return (
    <FieldWrapper className={className}>
      <FieldLabel htmlFor="country">{label}</FieldLabel>
      <Select
        id="country"
        name="country"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">—</option>
        {state.countries.map((country) => (
          <option key={country} value={country}>{country}</option>
        ))}
      </Select>
      {note && <FieldNote>{note}</FieldNote>}
    </FieldWrapper>
  );
};

const Select = styled.select`
  ${fieldBase}
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 36px;
  background-image: ${CHEVRON_SVG};
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
`;

export default CountrySelect;
