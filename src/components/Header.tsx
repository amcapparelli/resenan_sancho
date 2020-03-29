/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';

const Header = () => (
  <StyledContainer>
    <StyledLogo src="/static/logo.png" alt="logo reseñan sancho" />
    <Link href="/myprofile">
      <StyledLink>Mi perfil</StyledLink>
    </Link>
  </StyledContainer>
);

const StyledLogo = styledComponents.img`
  padding: 1rem 0 0 1rem;
  width: 25%;
`;

const StyledLink = styledComponents.a`
  text-decoration: none;
  align-self: center;
  justify-self: center;
  color: ${(props) => props.theme.main};
`;

const StyledContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15%;
`;

export default Header;
