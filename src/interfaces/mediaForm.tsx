export enum AvailableMedias {
  blog = 'blog',
  booktube = 'booktube',
  bookstagram = 'bookstagram',
  goodreads = 'goodreads',
  amazon = 'amazon',
}

export interface MediaForm {
  author: string,
  genres: Array<string>,
  formats: Array<string>,
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
