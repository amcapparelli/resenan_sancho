import { useReducer, useState } from 'react';
import { booksListLoad } from '../../store/reducers';
import { Book } from '../../interfaces/books';
import { mybooks as URL } from '../../config/routes';
import { Response } from '../../interfaces/response';

interface State {
  books: Array<Book>;
}
const initialState: State = {
  books: [],
};

const useUsersBooksListFetch = (): [State, Function, boolean, any] => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [state, dispatch] = useReducer(booksListLoad, initialState);
  const listRequest = async (userId: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${URL}/${userId}`, {
        method: 'get',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const books = await res.json();
      dispatch({
        type: 'USER_BOOKS_LIST_LOAD',
        payload: books,
      });
    } catch (error) {
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };
  return [state, listRequest, loading, response];
};

export default useUsersBooksListFetch;
