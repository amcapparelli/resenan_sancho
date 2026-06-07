import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import UserContext from '../store/context/userContext/UserContext';
import { LanguageSelector } from '.';
import NavBar from './NavBar';

// Derives a two-letter string from the user's name + lastName (e.g. "Ana López" → "AL").
// Falls back to the first two characters of the email if the name fields are missing,
// and to an empty string if nothing is available.
const getUserInitials = (name?: string, lastName?: string, email?: string): string => {
  const firstInitial = name?.trim()[0] ?? '';
  const lastInitial = lastName?.trim()[0] ?? '';

  if (firstInitial || lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  return email?.trim().slice(0, 2).toUpperCase() ?? '';
};

const Header: React.FC = (): JSX.Element => {
  const { isLogged, logoutRequest, user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: router.asPath });
  }, []);

  const userInitials = isLogged && user
    ? getUserInitials(user.name, user.lastName, user.email)
    : undefined;

  return (
    <>
      <LanguageSelector />
      <NavBar
        isLoggedIn={isLogged}
        userInitials={userInitials}
        onLogout={logoutRequest}
      />
    </>
  );
};

export default Header;
