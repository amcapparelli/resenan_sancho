import React, { useContext } from 'react';
import UserContext from '../store/context/userContext/UserContext';
import { BlogsLiterariosList, Header } from '../components';

const Home: React.FC = (): JSX.Element => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user.token && (
        <>
          <Header />
          <BlogsLiterariosList />
        </>
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
