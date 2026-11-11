import { AvailableGenres } from './genres';
import AvailableFormats from './formats';

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
  goodreads: {
    name: string,
    url: string,
  },
  amazon: {
    name: string,
    url: string,
  },
  // Added after the original five channels: documents saved before then
  // don't have these fields at all.
  tiktok?: {
    name: string,
    url: string,
  },
  podcast?: {
    name: string,
    url: string,
  },
  genres: Array<AvailableGenres>,
  formats: Array<AvailableFormats>,
  description: string,
}
