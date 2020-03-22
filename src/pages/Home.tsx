import React, { useContext } from 'react';
import UserContext from '../store/context/userContext/UserContext';

const Home: React.FC = (): JSX.Element => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user.token && (
        <h1>
          Hola
          {user.name}
        </h1>
      )}
      {!user.token && (
        <h1>
          No estás loguedo
        </h1>
      )}
    </>
  );
};

export default Home;
