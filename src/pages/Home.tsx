import React from 'react';
import { BlogsLiterariosList } from '../components';
import { PublicZoneLayout } from '../components/Layouts';

const Home: React.FC = (): JSX.Element => (
  <>
    <PublicZoneLayout />
    <BlogsLiterariosList />
  </>
);

export default Home;
