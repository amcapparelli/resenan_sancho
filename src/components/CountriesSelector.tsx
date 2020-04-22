import React, { useEffect, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  FormHelperText,
  Select,
  InputLabel,
  OutlinedInput,
} from '@material-ui/core';
import { countriesListLoad } from '../store/reducers';

interface State {
  countries: Array<any>;
}
const initialState: State = {
  countries: [],
};

interface MyProps {
  countrySelected: string
  onChange: Function
}

const CountriesSelector: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { t } = useTranslation();
  const { countrySelected, onChange } = props;
  const [state, dispatch] = useReducer(countriesListLoad, initialState);
  useEffect(() => {
    const listCountries = async () => {
      const response = await fetch('https://restcountries.eu/rest/v2/all');
      const countries = await response.json();
      dispatch({
        type: 'COUNTRIES_LIST_LOAD',
        payload: { countries },
      });
    };
    listCountries();
  }, []);

  return (
    <div>
      <FormControl variant="outlined">
        <InputLabel
          shrink={!!countrySelected}
          htmlFor="countriesSelector"
        >
          {t('components.countriesSelector.title')}
        </InputLabel>
        <Select
          native
          displayEmpty
          value={countrySelected}
          onChange={(e) => onChange && onChange(e)}
          label={t('components.countriesSelector.title')}
          inputProps={{
            name: 'country',
            id: 'countriesSelector',
          }}
          input={
            (
              <OutlinedInput
                name="country"
                id="outlined-country-simple"
                notched
                labelWidth={countrySelected ? 25 : 0}
              />
            )
          }
        >
          <option aria-label="None" value="" />
          {
            state.countries.map((country) => <option value={country}>{country}</option>)
          }
        </Select>
        <FormHelperText>
          Si reseñas libros, este dato puede ayudar a muchos autores y editoriales que buscan
          reseñadores por país para enviar ejemplares impresos o invitaciones a presentaciones
          de libros.
        </FormHelperText>
      </FormControl>
    </div>
  );
};

export default CountriesSelector;
