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
      console.log("countries", action.payload)
      const { countries } = action.payload;
      return {
        countries: [...state.countries, ...countries.map((country) => country.name.common)],
      };
    }
    default: return state;
  }
};
