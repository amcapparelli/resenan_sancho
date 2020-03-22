import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';
import { login } from '../../../config/routes';
import { UserLogged } from '../../../interfaces/user';

interface MyProps {
  children: JSX.Element[],
}

const UserContextProvider: React.FC<MyProps> = (props: MyProps) => {
  const { children } = props;
  const [user, setUser] = useState({
    _id: undefined,
    name: undefined,
    lastName: undefined,
    email: undefined,
    token: undefined,
  });
  useEffect(() => {
    async function fetchUserSession() {
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await fetch(`${login}/${token}`, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        });
        const session = await response.json();
        const { userSession } = session;
        setUser(userSession);
      }
    }
    fetchUserSession();
  }, [user.token]);

  const setUserLogged = (userLogged: UserLogged): void => {
    setUser(userLogged);
    sessionStorage.setItem('token', userLogged.token);
  };
  return (
    <UserContext.Provider value={{ user, setUserLogged }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
