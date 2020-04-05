import React from 'react';
import { Header } from '..';

interface MyProps {
  children: JSX.Element,
}

const PublicZoneLayout: React.FC = ({ children }: MyProps): JSX.Element => (
  <>
    <Header />
    {children}
  </>
);

export default PublicZoneLayout;
