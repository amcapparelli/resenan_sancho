/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styledComponents from 'styled-components';
import { Button } from '@material-ui/core';
import UserContext from '../store/context/userContext/UserContext';
import { LanguageSelector } from '.';

const Header: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { isLogged, logoutRequest } = useContext(UserContext);
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
          <Link href="/books">
            <StyledLink aria-label="Find Books">{t('nav.availableBooks')}</StyledLink>
          </Link>
          <Link href="/reviewers">
            <StyledLink aria-label="Find Reviewers">{t('nav.reviewers')}</StyledLink>
          </Link>
        </StyledNav>
        <StyledPrivateNav>
          {
            isLogged
              ? (
                <>
                  <Link href="/myprofile">
                    <StyledProfileButton
                      aria-label="Private Area"
                      variant="contained"
                      color="primary"
                    >
                      {t('nav.myProfile')}
                    </StyledProfileButton>
                  </Link>
                  <Button onClick={logoutRequest} aria-label="Logout">Logout</Button>
                </>
              ) : (
                <Link href="/login">
                  <StyledLink aria-label="Login">Login</StyledLink>
                </Link>
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

const StyledLink = styledComponents.a`
  text-decoration: none;
  align-self: center;
  justify-self: center;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1.2rem;
  color: ${(props) => props.theme.dark};
  :hover{
    cursor: pointer;
  }
`;

export default Header;
