import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserContext from './UserContext';
import { login, logout } from '../../../config/routes';
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    async function fetchUserSession() {
      try {
        const response = await fetch(`${login}/session`, {
          method: 'get',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const session = await response.json();
        const { userSession } = session;
        setUser(userSession);
        if (userSession.token) setIsLogged(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserSession();
  }, []);

  const setUserLogged = (userLogged: UserLogged): void => {
    setUser(userLogged);
    if (userLogged.token) setIsLogged(true);
  };

  const resetUser = (): void => {
    setUser(initialUser);
    setIsLogged(false);
  };

  const logoutRequest = async (): Promise<void> => {
    try {
      await fetch(logout, {
        method: 'get',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      setUser(initialUser);
      setIsLogged(false);
      router.push('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUserLogged,
      isLogged,
      logoutRequest,
      loading,
      resetUser,
    }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
