export interface User {
  _id?: string,
  name: string,
  lastName: string,
  email: string,
}

export interface UserRegister extends User {
  password: string,
}

export interface UserLogged {
  user: User
  setUserLogged(userLogged: User): void,
}
