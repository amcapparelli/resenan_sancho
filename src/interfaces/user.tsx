export interface User {
  name: string,
  lastName: string,
  email: string,
}

export interface UserRegister extends User {
  password: string,
}

export interface UserLogged extends User {
  _id: string,
  token: string,
}

export interface IUserContext {
  user: UserLogged
  setUserLogged(userLogged: UserLogged): void,
}
