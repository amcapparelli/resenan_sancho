export interface Book {
  _id: string,
  title: string,
  formats: Array<string>,
  genre: string,
  author: {
    name: string,
    lastName: string,
  },
  cover: string,
  synopsis: string,
  pages: number
  copies: number,
}

export interface BookForm {
  [key: string]: any,
  title: string,
  cover: string,
  formats: Array<string>,
  datePublished: string,
  author: string,
  synopsis: string,
  genre: string,
}

export interface BookFormErrors {
  [key: string]: any,
  title: string,
  cover: string,
  formats: string,
  datePublished: string,
  author: string,
  synopsis: string,
  editorial: string,
  genre: string,
  pages: string,
}
