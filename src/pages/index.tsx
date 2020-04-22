import React from 'react';
import { ReviewersList } from '../components';
import { PublicZoneLayout } from '../components/Layouts';

const Home: React.FC = (): JSX.Element => (
  <>
    <PublicZoneLayout />
    <ReviewersList />
  </>
);

export default Home;
