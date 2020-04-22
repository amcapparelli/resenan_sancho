import { AvailableGenres } from './genres';

export interface Reviewer {
  author: {
    name: string,
    lastName: string
    avatar: string,
    country: string,
  },
  blog: {
    name: string,
    url: string,
  },
  bookstagram: {
    name: string,
    url: string,
  },
  genres: Array<AvailableGenres>
}
