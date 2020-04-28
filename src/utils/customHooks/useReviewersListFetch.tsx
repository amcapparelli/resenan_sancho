import { useReducer } from 'react';
import { reviewersListLoad } from '../../store/reducers';
import { reviewers as URL } from '../../config/routes';

interface State {
  reviewers: Array<any>;
}
const initialState: State = {
  reviewers: [],
};

interface Filters {
  [key: string]: string,
}

const useReviewersListFetch = (): [State, Function] => {
  const [state, dispatch] = useReducer(reviewersListLoad, initialState);
  const listRequest = async (filters: Filters = {}): Promise<void> => {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const queryString = Object.keys(filters).map((key) => `${key}=${filters[key]}`).join('&');
    try {
      const response = await fetch(`${URL}?${queryString}`, options);
      const blogs = await response.json();
      dispatch({
        type: 'REVIEWERS_LIST_LOAD',
        payload: blogs,
      });
    } catch (error) {
      dispatch({ type: 'REVIEWERS_LIST_ERROR', payload: error });
    }
  };
  return [state, listRequest];
};

export default useReviewersListFetch;
