/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';
import UserContext from '../store/context/userContext/UserContext';

const Header: React.FC = (): JSX.Element => {
  const { isLogged } = useContext(UserContext);
  return (
    <StyledHeaderContainer>
      <header>
        <Link href="/home">
          <StyledLogo src="/static/logo.png" alt="logo reseñan sancho" />
        </Link>
      </header>
      <StyledNav>
        <Link href="/books">
          <StyledLink>Libros Disponibles</StyledLink>
        </Link>
        <Link href="/books">
          <StyledLink>Reseñadores</StyledLink>
        </Link>
        {
          isLogged
            ? (
              <Link href="/myprofile">
                <StyledLink>Mi perfil</StyledLink>
              </Link>
            ) : (
              <Link href="/login">
                <StyledLink>Login</StyledLink>
              </Link>
            )
        }
      </StyledNav>
    </StyledHeaderContainer>
  );
};

const StyledNav = styledComponents.nav`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 2rem;
`;

const StyledLogo = styledComponents.img`
  padding: 1rem 0 1rem 2rem;
  width: 40%;
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

const StyledHeaderContainer = styledComponents.div`
  grid-template-columns: 1fr 3fr;
  grid-gap: 15%;
  margin: 0;
  display: block;
  height: 5rem;
  display: grid;
`;


export default Header;
