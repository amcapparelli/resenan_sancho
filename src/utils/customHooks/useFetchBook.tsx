import { useState, useReducer } from 'react';
import { Response } from '../../interfaces/response';
import { bookLoad } from '../../store/reducers';
import { Book } from '../../interfaces/books';
import { book as URL } from '../../config/routes';

const initialState: Book = {
  _id: '',
  title: '',
  formats: [],
  genre: '',
  author: {
    name: '',
    lastName: '',
  },
  cover: '',
  synopsis: '',
  pages: null,
};

const useFetchBook = (): [any, Function, boolean, any] => {
  const [state, dispatch] = useReducer(bookLoad, initialState);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const fetchBook = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      const resp = await fetch(`${URL}/${id}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      });
      const book = await resp.json();
      dispatch({
        type: 'BOOK_LOAD',
        payload: book,
      });
    } catch (error) {
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };
  return [state, fetchBook, loading, response];
};

export default useFetchBook;
