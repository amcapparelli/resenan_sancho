import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { trackingId } from '../utils/constants/GATrackingID';
import { ReviewersList } from '../components';
import { PublicZoneLayout } from '../components/Layouts';

const Home: React.FC = (): JSX.Element => {
  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.pageview('/reviewers');
  }, []);
  return (
    <>
      <PublicZoneLayout>
        <div>
          <ReviewersList />
        </div>
      </PublicZoneLayout>
    </>
  );
};

export default Home;
