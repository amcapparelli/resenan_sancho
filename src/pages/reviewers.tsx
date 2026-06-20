import React from 'react';
import ReviewersPage from '../views/ReviewersPage';
import { PublicZoneLayout } from '../components/Layouts';
import { Seo } from '../components';

const Home: React.FC = (): JSX.Element => (
  <>
    <Seo
      title="Reseñadores literarios | Reseñan Sancho"
      description="Encuentra reseñadores literarios para tu libro: booktubers, bookstagrammers y blogs especializados. Filtra por género y conecta con quien mejor encaje con tu obra."
      path="/reviewers"
    />
    <PublicZoneLayout>
      <ReviewersPage />
    </PublicZoneLayout>
  </>
);


export default Home;
