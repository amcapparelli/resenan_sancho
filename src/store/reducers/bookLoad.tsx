import { Book } from '../../interfaces/books';

interface BooksList {
  book: Book
}

interface IAction {
  type: string,
  payload: BooksList,
}

export default (state: Book, action: IAction) => {
  switch (action.type) {
    case 'BOOK_LOAD': {
      const { book } = action.payload;
      return { ...book };
    }
    default: return state;
  }
};
