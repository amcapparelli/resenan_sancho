import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserContext from './UserContext';
import { login } from '../../../config/routes';
import { UserLogged } from '../../../interfaces/user';

interface MyProps {
  children: JSX.Element,
}

const initialUser: UserLogged = {
  _id: undefined,
  name: undefined,
  lastName: undefined,
  email: undefined,
  token: undefined,
};

const UserContextProvider: React.FC<MyProps> = (props: MyProps) => {
  const { children } = props;
  const [user, setUser] = useState(initialUser);
  const [isLogged, setIsLogged] = useState<boolean>(user.token !== undefined);
  const router = useRouter();
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
        if (userSession.token) setIsLogged(true);
      }
    }
    fetchUserSession();
  }, []);

  const setUserLogged = (userLogged: UserLogged): void => {
    setUser(userLogged);
    if (userLogged.token) setIsLogged(true);
    sessionStorage.setItem('token', userLogged.token);
  };
  const logout = (): void => {
    sessionStorage.removeItem('token');
    setUser(initialUser);
    setIsLogged(true);
    router.push('/login');
  };

  return (
    <UserContext.Provider value={{
      user,
      setUserLogged,
      isLogged,
      logout,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
