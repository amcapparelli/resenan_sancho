import React from 'react';
import { Header, Footer } from '..';

interface MyProps {
  children: JSX.Element[] | JSX.Element,
  showFooter?: boolean
}

const PublicZoneLayout: React.FC<MyProps> = ({ children, showFooter }: MyProps): JSX.Element => (
  <>
    <Header />
    {children}
    {showFooter && <Footer />}
  </>
);

export default PublicZoneLayout;
