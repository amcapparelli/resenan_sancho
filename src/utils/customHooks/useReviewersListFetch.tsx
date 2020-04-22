import { useReducer } from 'react';
import { reviewersListLoad } from '../../store/reducers';
import { reviewers as URL } from '../../config/routes';

interface State {
  reviewers: Array<any>;
}
const initialState: State = {
  reviewers: [],
};

const useReviewersListFetch = (): [State, Function] => {
  const [state, dispatch] = useReducer(reviewersListLoad, initialState);
  const listRequest = async (): Promise<void> => {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(URL, options);
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
