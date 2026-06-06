import React from 'react';
import styledComponents from 'styled-components';
import NavActions from './NavActions';

interface NavBarProps {
  isLoggedIn: boolean;
  userInitials?: string;
  onLogout(): void;
}

const NavBar = ({ isLoggedIn, userInitials, onLogout }: NavBarProps): JSX.Element => (
  <NavBarWrapper>
    <StyledLogo src="/static/logo-web.webp" alt="logo reseñan sancho" />
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
  gap: 32px;
  background: ${({ theme }) => theme.white};
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};
  padding: 10px 28px;
`;

const StyledLogo = styledComponents.img`
  height: 48px;
  width: auto;

  @media (max-width: 480px) {
    height: 36px;
  }
`;

export default NavBar;
