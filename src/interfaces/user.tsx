import { Media } from './mediaForm';

export interface User {
  [key: string]: any,
  name: string,
  lastName: string,
  email: string,
}

export interface UserRegister extends User {
  password: string,
}

export interface UserLogged extends User {
  name: string,
  _id: string,
  token: string,
  reviewerInfo?: {
    [key: string]: any,
    description: string
    genres: Array<string>,
    formats: Array<string>
    blog?: Media,
    booktube?: Media
    bookstagram?: Media,
    goodreads?: Media,
    amazon?: Media,
  }
}

export interface IUserContext {
  user: UserLogged
  setUserLogged(userLogged: UserLogged): void,
  isLogged: boolean,
  logout(): void,
}
