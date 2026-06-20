import React from 'react';
import AccountPage from '../views/AccountPage';
import { PublicZoneLayout } from '../components/Layouts';

const Account: React.FC = (): JSX.Element => (
  <PublicZoneLayout>
    <AccountPage />
  </PublicZoneLayout>
);

export default Account;
