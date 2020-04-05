import { Book } from '../../interfaces/books';

interface BooksList {
  books: Array<Book>
}

interface IAction {
  type: string,
  payload: BooksList,
}

export default (state: BooksList, action: IAction) => {
  switch (action.type) {
    case 'BOOKS_LIST_LOAD': {
      const { books } = action.payload;
      return {
        books: [...state.books, ...books],
      };
    }
    default: return state;
  }
};
