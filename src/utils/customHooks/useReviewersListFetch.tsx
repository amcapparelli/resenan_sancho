import { useReducer, useState } from 'react';
import { reviewersListLoad } from '../../store/reducers';
import { reviewers as URL } from '../../config/routes';
import { buildQueryString, QueryParams } from '../buildQueryString';

interface State {
  reviewers: Array<any>;
  totalElements: number,
  totalPages: number,
}
const initialState: State = {
  reviewers: [],
  totalElements: 0,
  totalPages: 0,
};

type Filters = QueryParams;

const useReviewersListFetch = (): [State, Function, boolean] => {
  const [state, dispatch] = useReducer(reviewersListLoad, initialState);
  const [loading, setLoading] = useState(false);
  const listRequest = async (filters: Filters = {}): Promise<void> => {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const queryString = buildQueryString(filters);
    try {
      setLoading(true);
      const response = await fetch(`${URL}?${queryString}`, options);
      const { reviewers, totalElements, totalPages } = await response.json();
      dispatch({
        type: 'REVIEWERS_LIST_LOAD',
        payload: { reviewers, totalElements, totalPages },
      });
    } catch (error) {
      dispatch({ type: 'REVIEWERS_LIST_ERROR', payload: error });
    } finally {
      setLoading(false);
    }
  };
  return [state, listRequest, loading];
};

export default useReviewersListFetch;
