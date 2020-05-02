import React from 'react';
import { ReviewersList } from '../components';
import { PublicZoneLayout } from '../components/Layouts';

const Home: React.FC = (): JSX.Element => (
  <>
    <PublicZoneLayout>
      <div>
        <ReviewersList />
      </div>
    </PublicZoneLayout>
  </>
);

export default Home;
