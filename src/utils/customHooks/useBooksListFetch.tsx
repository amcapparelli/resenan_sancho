import { useReducer, useState } from 'react';
import { booksListLoad } from '../../store/reducers';
import { Book } from '../../interfaces/books';
import { books as URL } from '../../config/routes';
import { buildQueryString, QueryParams } from '../buildQueryString';

interface State {
  books: Array<Book>,
  totalElements?: number,
  totalPages?: number,
}
const initialState: State = {
  books: [],
  totalElements: 0,
  totalPages: 0,
};

type Filters = QueryParams;

/**
 * List fetch state for /books. When `seedState` is provided (SSR-rendered data
 * from getServerSideProps) the reducer starts already populated, so the first
 * paint shows real results with no skeleton flash and the view can skip the
 * redundant mount fetch. Without a seed it behaves exactly as before.
 */
const useBooksListFetch = (seedState?: State): [State, Function, boolean] => {
  const [state, dispatch] = useReducer(booksListLoad, seedState ?? initialState);
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
      const books = await response.json();
      dispatch({
        type: 'BOOKS_LIST_LOAD',
        payload: books,
      });
    } catch (error) {
      dispatch({ type: 'BOOKS_LIST_ERROR', payload: error });
    } finally {
      setLoading(false);
    }
  };
  return [state, listRequest, loading];
};

export default useBooksListFetch;
