export enum AvailableMedias {
  blog = 'blog',
  booktube = 'booktube',
  bookstagram = 'bookstagram',
  goodreads = 'goodreads',
  amazon = 'amazon',
}

export interface Media {
  selected: boolean,
  url: string,
  name: string
}

export interface MediaForm {
  author: string,
  genres: Array<string>,
  formats: Array<string>,
  description: string,
  blog: Media,
  booktube: Media,
  bookstagram: Media,
  goodreads: Media,
  amazon: Media,
}
