import { Book } from '../../interfaces/books';

interface BooksList {
  books: Array<Book>,
  totalElements?: number,
  totalPages?: number,
}

interface IAction {
  type: string,
  payload: {
    books: Array<Book>,
    totalElements: number,
    totalPages: number,
  }
}

export default (state: BooksList, action: IAction) => {
  switch (action.type) {
    case 'BOOKS_LIST_LOAD': {
      const { books, totalElements, totalPages } = action.payload;
      return {
        books: [...books],
        totalElements,
        totalPages,
      };
    }
    case 'USER_BOOKS_LIST_LOAD': {
      const { books } = action.payload;
      return {
        books,
      };
    }
    default: return state;
  }
};
