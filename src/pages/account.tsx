import React from 'react';
import AccountPage from '../views/AccountPage';
import { PublicZoneLayout } from '../components/Layouts';
import { Seo } from '../components';

const Account: React.FC = (): JSX.Element => (
  <>
    <Seo noindex title="Mi cuenta | Reseñan Sancho" description="Área personal de Reseñan Sancho." path="/account" />
    <PublicZoneLayout>
      <AccountPage />
    </PublicZoneLayout>
  </>
);

export default Account;
