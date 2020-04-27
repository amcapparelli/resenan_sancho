import { AvailableGenres } from './genres';

enum formats { 'ePUB', 'papel', 'mobi', 'PDF', 'audiolibro' }

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
  booktube: {
    name: string,
    url: string,
  },
  bookstagram: {
    name: string,
    url: string,
  },
  genres: Array<AvailableGenres>,
  formats: Array<formats>,
  description: string,
}
