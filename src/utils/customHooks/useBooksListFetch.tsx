import { useReducer, useState } from 'react';
import { booksListLoad } from '../../store/reducers';
import { Book } from '../../interfaces/books';
import { books as URL } from '../../config/routes';

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

interface Filters {
  [key: string]: string,
}

const useBooksListFetch = (): [State, Function, boolean] => {
  const [state, dispatch] = useReducer(booksListLoad, initialState);
  const [loading, setLoading] = useState(false);
  const listRequest = async (filters: Filters = {}): Promise<void> => {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const queryString = Object.keys(filters).map((key) => `${key}=${filters[key]}`).join('&');
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
