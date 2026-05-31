import React, { useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styledComponents from 'styled-components';
import { Button } from '@mui/material';
import ReactGA from "react-ga4";
import UserContext from '../store/context/userContext/UserContext';
import { LanguageSelector } from '.';

const Header: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { isLogged, logoutRequest } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: router.asPath });
  }, []);
  return (
    <>
      <LanguageSelector />
      <StyledHeaderContainer>
        <header>
          <Link href="/">
            <StyledLogo src="/static/logo-web.webp" alt="logo reseñan sancho" />
          </Link>
        </header>
        <StyledNav>
          <StyledNavLink href="/books" aria-label="Find Books">{t('nav.availableBooks')}</StyledNavLink>
          <StyledNavLink href="/reviewers" aria-label="Find Reviewers">{t('nav.reviewers')}</StyledNavLink>
        </StyledNav>
        <StyledPrivateNav>
          {
            isLogged
              ? (
                <>
                  <StyledProfileButton
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    component={Link as any}
                    href="/myprofile"
                    aria-label="Private Area"
                    variant="contained"
                    color="primary"
                  >
                    {t('nav.myProfile')}
                  </StyledProfileButton>
                  <Button onClick={logoutRequest} aria-label="Logout">Logout</Button>
                </>
              ) : (
                <StyledNavLink href="/login" aria-label="Login">Login</StyledNavLink>
              )
          }
        </StyledPrivateNav>
      </StyledHeaderContainer>
    </>
  );
};

const StyledProfileButton = styledComponents(Button)`
  @media (max-width: 768px) {
    height: 100%;
  }
  width: 60%;
  height: 40%;
  justify-self: end;
  align-self: center;
  :hover{
    cursor: pointer;
    color: ${(props) => props.theme.main};
  }
`;
const StyledHeaderContainer = styledComponents.div`
  @media (max-width: 375px) {
    grid-gap: 3%;
    grid-template-columns: 1fr 2fr 2fr;
  }
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 5%;
  margin: 0;
  display: block;
  height: 5rem;
  display: grid;
`;

const StyledNav = styledComponents.nav`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 2rem;
`;

const StyledPrivateNav = styledComponents.nav`
  @media (max-width: 375px) {
    grid-gap: 1%;
  }
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 2rem;
`;

const StyledLogo = styledComponents.img`
  @media (max-width: 375px) {
    width: 100%;
    padding: 0;
  }
  padding: 1rem 0 1rem 2rem;
  width: 30%;
`;

const StyledNavLink = styledComponents(Link)`
  text-decoration: none;
  align-self: center;
  justify-self: center;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1.2rem;
  color: ${(props) => props.theme.dark};
  :hover {
    cursor: pointer;
  }
`;

export default Header;
