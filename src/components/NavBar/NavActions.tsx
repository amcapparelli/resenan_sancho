import React from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';

interface NavActionsProps {
  isLoggedIn: boolean;
  userInitials?: string;
  onLogout(): void;
}

const NavActions = ({ isLoggedIn, userInitials = '', onLogout }: NavActionsProps): JSX.Element => (
  <ActionsWrapper>
    <NavLink href="/books" aria-label="Buscar libros">
      Libros
    </NavLink>
    <NavLink href="/reviewers" aria-label="Buscar reseñadores">
      Reseñadores
    </NavLink>

    {isLoggedIn ? (
      <>
        <ProfileButton href="/account" aria-label="Ir a mi perfil">
          <Avatar aria-hidden="true">{userInitials}</Avatar>
          Mi área personal
        </ProfileButton>
        {/* Logout is kept as a minimal text action to not compete visually with "Mi perfil" */}
        <LogoutButton type="button" onClick={onLogout} aria-label="Cerrar sesión">
          Salir
        </LogoutButton>
      </>
    ) : (
      <LoginButton href="/login" aria-label="Iniciar sesión">
        Login
      </LoginButton>
    )}
  </ActionsWrapper>
);

const ActionsWrapper = styledComponents.div`
  display: flex;
  align-items: center;
  gap: 22px;
  padding-top: 6px;
`;

const NavLink = styledComponents(Link)`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: ${({ theme }) => theme.brown};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.terracotta};
  }

  /* Hide nav links on small screens; the logo and session button stay visible */
  @media (max-width: 480px) {
    display: none;
  }
`;

const LoginButton = styledComponents(Link)`
  display: inline-block;
  background: transparent;
  color: ${({ theme }) => theme.terracotta};
  border: 1.5px solid ${({ theme }) => theme.terracotta};
  border-radius: 6px;
  padding: 6px 16px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  /* Ensure 44px touch target on mobile */
  min-height: 44px;
  line-height: 30px;

  @media (min-width: 481px) {
    min-height: unset;
    line-height: normal;
  }

  &:hover {
    background: ${({ theme }) => theme.terracotta};
    color: ${({ theme }) => theme.white};
  }
`;

const ProfileButton = styledComponents.a`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${({ theme }) => theme.terracotta};
  color: ${({ theme }) => theme.white};
  border: none;
  border-radius: 6px;
  padding: 5px 14px 5px 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;
  /* Ensure 44px touch target on mobile */
  min-height: 44px;

  @media (min-width: 481px) {
    min-height: unset;
  }

  &:hover {
    background: #a84a1b;
  }
`;

const Avatar = styledComponents.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.amber};
  color: ${({ theme }) => theme.ink};
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  /* Uppercase to match the "AL"-style initials pattern */
  text-transform: uppercase;
`;

// A deliberately low-visual-weight logout action sitting alongside "Mi perfil".
// Using a plain text button keeps focus on the profile CTA.
const LogoutButton = styledComponents.button`
  background: none;
  border: none;
  padding: 0;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.brown};
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.terracotta};
  }
`;

export default NavActions;
