import React, { useEffect, useReducer } from 'react';
import styledComponents from 'styled-components';
import { books as URL } from '../config/routes';
import { booksListLoad } from '../store/reducers';
import { Book } from '../interfaces/books';
import { BookListItem } from '.';

interface State {
  books: Array<Book>;
}
const initialState: State = {
  books: [],
};

const BooksList = () => {
  const [state, dispatch] = useReducer(booksListLoad, initialState);
  useEffect(() => {
    async function fetchBooksList() {
      try {
        const response = await fetch(`${URL}`, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        });
        const books = await response.json();
        dispatch({
          type: 'BOOKS_LIST_LOAD',
          payload: books,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchBooksList();
  }, []);
  return (
    <div>
      <StyledList>
        {
          state.books.map(
            // eslint-disable-next-line no-underscore-dangle
            (book) => <li key={book._id}><BookListItem book={book} /></li>,
          )
        }
      </StyledList>
    </div>
  );
};

const StyledList = styledComponents.ul`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
`;

export default BooksList;
