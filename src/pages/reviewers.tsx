import React from 'react';
import ReviewersPage from '../views/ReviewersPage';
import { PublicZoneLayout } from '../components/Layouts';

const Home: React.FC = (): JSX.Element => (
  <>
    <PublicZoneLayout>
      <ReviewersPage />
    </PublicZoneLayout>
  </>
);


export default Home;
