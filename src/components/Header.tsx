/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styledComponents from 'styled-components';
import { Button } from '@material-ui/core';
import UserContext from '../store/context/userContext/UserContext';

const Header: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { isLogged, logoutRequest } = useContext(UserContext);
  return (
    <StyledHeaderContainer>
      <header>
        <Link href="/">
          <StyledLogo src="/static/logo.png" alt="logo reseñan sancho" />
        </Link>
      </header>
      <StyledNav>
        <Link href="/books">
          <StyledLink>{t('nav.availableBooks')}</StyledLink>
        </Link>
        <Link href="/reviewers">
          <StyledLink>{t('nav.reviewers')}</StyledLink>
        </Link>
      </StyledNav>
      <StyledPrivateNav>
        {
          isLogged
            ? (
              <>
                <Link href="/myprofile">
                  <StyledProfileButton
                    variant="contained"
                    color="primary"
                  >
                    {t('nav.myProfile')}
                  </StyledProfileButton>
                </Link>
                <Button onClick={logoutRequest}>Logout</Button>
              </>
            ) : (
              <Link href="/login">
                <StyledLink>Login</StyledLink>
              </Link>
            )
        }
      </StyledPrivateNav>
    </StyledHeaderContainer>
  );
};

const StyledProfileButton = styledComponents(Button)`
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
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 2rem;
`;

const StyledLogo = styledComponents.img`
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
