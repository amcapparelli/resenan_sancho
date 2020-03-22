import { createContext } from 'react';
import { IUserContext } from '../../../interfaces/user';

const UserContext = createContext<IUserContext>(null);

export default UserContext;
