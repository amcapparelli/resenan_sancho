import React, { useContext } from 'react';
import UserContext from '../store/context/userContext/UserContext';

const Home: React.FC = (): JSX.Element => {
  const { user } = useContext(UserContext);
  return (
    <>
      <h1>
        Hola
        {user.name}
      </h1>
    </>
  );
};

export default Home;
