interface CountriesList {
  countries: Array<any>
}

interface IAction {
  type: string,
  payload: CountriesList,
}

export default (state: CountriesList, action: IAction) => {
  switch (action.type) {
    case 'COUNTRIES_LIST_LOAD': {
      const { countries } = action.payload;
      return {
        countries: [...state.countries, ...countries.map((country) => country.name)],
      };
    }
    default: return state;
  }
};
