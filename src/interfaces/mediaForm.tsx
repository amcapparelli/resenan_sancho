export interface MediaForm {
  author: string,
  genres: Array<string>,
  blog: {
    selected: boolean,
  },
  booktube: {
    selected: boolean,
  },
  bookstagram: {
    selected: boolean,
  },
  goodreads: {
    selected: boolean,
  },
  amazon: {
    selected: boolean,
  }
}