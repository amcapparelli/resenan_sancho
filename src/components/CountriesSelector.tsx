import React, { useEffect, useReducer } from 'react';
import { FormControl, Select, InputLabel } from '@material-ui/core';
import { countriesListLoad } from '../store/reducers';

interface State {
  countries: Array<any>;
}
const initialState: State = {
  countries: [],
};

const CountriesSelector = () => {
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
  const handleChange = () => {
    console.log('handlechange');
  };
  return (
    <div>
      <FormControl variant="filled">
        <InputLabel htmlFor="filled-age-native-simple">country</InputLabel>
        <Select
          native
          // value={state.age}
          onChange={handleChange}
          inputProps={{
            name: 'country',
          }}
        >
          <option aria-label="None" value="" />
          {
            state.countries.map((country) => <option value={country}>{country}</option>)
          }
        </Select>
      </FormControl>
    </div>
  );
};

export default CountriesSelector;
