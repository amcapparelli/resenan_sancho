import React, { useState } from 'react';
import UserContext from './UserContext';
import { User } from '../../../interfaces/user';

interface MyProps {
  children: JSX.Element[],
}

const UserContextProvider: React.FC<MyProps> = (props: MyProps) => {
  const { children } = props;
  const [user, setUser] = useState({
    name: undefined,
    lastName: undefined,
    email: undefined,
  });
  const setUserLogged = (userLogged: User): void => {
    setUser(userLogged);
  };
  return (
    <UserContext.Provider value={{ user, setUserLogged }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
