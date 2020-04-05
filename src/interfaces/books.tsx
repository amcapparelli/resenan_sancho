export interface Book {
  _id: string,
  title: string,
  author: {
    name: string,
    lastName: string,
  },
  cover: string,
}
