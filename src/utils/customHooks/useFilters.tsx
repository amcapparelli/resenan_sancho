import { useState } from 'react';

const useFilters = (props: any): [any, Function, Function] => {
  const [filters, setFilters] = useState(props);
  const setFilterValues = (
    name: string,
    value: string,
  ): void => setFilters({ ...filters, [name]: value });
  const loadFilters = (filterValues: object) => {
    setFilters(filterValues);
  };
  return [filters, setFilterValues, loadFilters];
};

export default useFilters;
