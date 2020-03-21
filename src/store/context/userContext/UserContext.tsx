import { createContext } from 'react';
import { UserLogged } from '../../../interfaces/user';

const UserContext = createContext<UserLogged>(null);

export default UserContext;
