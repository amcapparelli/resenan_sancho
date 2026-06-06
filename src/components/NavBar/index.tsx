import React from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';
import NavActions from './NavActions';

interface NavBarProps {
  isLoggedIn: boolean;
  userInitials?: string;
  onLogout(): void;
}

const NavBar = ({ isLoggedIn, userInitials, onLogout }: NavBarProps): JSX.Element => (
  <NavBarWrapper>
    <LogoGroup>
      <Link href="/">
        <StyledLogo src="/static/logo-web.webp" alt="logo reseñan sancho" />
      </Link>
      <Tagline>Reseñan, Sancho, señal que somos escritores.</Tagline>
    </LogoGroup>
    <NavActions
      isLoggedIn={isLoggedIn}
      userInitials={userInitials}
      onLogout={onLogout}
    />
  </NavBarWrapper>
);

const NavBarWrapper = styledComponents.header`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 64px;
  background: ${({ theme }) => theme.white};
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};
  padding: 18px 28px;
`;

const LogoGroup = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledLogo = styledComponents.img`
  height: 48px;
  width: auto;

  @media (max-width: 480px) {
    height: 36px;
  }
`;

const Tagline = styledComponents.p`
  margin: 0;
  padding-left: 3px;
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 12px;
  color: ${({ theme }) => theme.brown};
`;

export default NavBar;
