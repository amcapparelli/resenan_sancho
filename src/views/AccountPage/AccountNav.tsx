import React from 'react';
import styled from 'styled-components';
import { AccountSection } from './types';

// ─── Section icons (18px, currentColor) ─────────────────────────────────────

const ProfileIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SpacesIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const BooksIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const AddBookIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const HelpIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface SectionConfig {
  key: AccountSection;
  label: string;
  Icon: React.FC;
}

const SECTION_CONFIG: SectionConfig[] = [
  { key: 'profile', label: 'Perfil', Icon: ProfileIcon },
  { key: 'spaces', label: 'Espacios literarios', Icon: SpacesIcon },
  { key: 'books', label: 'Mis libros', Icon: BooksIcon },
  { key: 'addBook', label: 'Añade libro', Icon: AddBookIcon },
  { key: 'help', label: 'Ayuda', Icon: HelpIcon },
];

interface AccountNavProps {
  activeSection: AccountSection;
  onSelect: (section: AccountSection) => void;
}

const AccountNav: React.FC<AccountNavProps> = ({ activeSection, onSelect }) => (
  <Nav aria-label="Secciones de tu cuenta">
    {SECTION_CONFIG.map(({ key, label, Icon }) => {
      const active = key === activeSection;
      return (
        <NavItem
          key={key}
          type="button"
          $active={active}
          aria-current={active ? 'page' : undefined}
          onClick={() => onSelect(key)}
        >
          <Icon />
          <span>{label}</span>
        </NavItem>
      );
    })}
  </Nav>
);

// ─── Styled ─────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: sticky;
  top: 12px;

  @media (max-width: 899px) {
    flex-direction: row;
    gap: 4px;
    top: 0;
    z-index: 10;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    background: ${({ theme }) => theme.fondoApp};
    padding: 8px 16px;
    margin: 0 -16px;
    border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};
    box-shadow: 0 2px 12px rgba(61, 58, 53, 0.06);

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

interface NavItemProps {
  $active: boolean;
}

const NavItem = styled.button<NavItemProps>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  min-height: 44px;
  text-align: left;
  cursor: pointer;
  border: none;
  background: ${({ $active, theme }) => ($active ? theme.white : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.ink : theme.brown)};
  border-left: 3px solid ${({ $active, theme }) => ($active ? theme.amber : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 4px rgba(61,58,53,0.07)' : 'none')};
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.ink};
  }

  @media (max-width: 899px) {
    flex-shrink: 0;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.lightBorder};
    border-left-width: 1px;
    box-shadow: none;
    font-size: 13px;
    min-height: 40px;
    white-space: nowrap;
    background: ${({ $active, theme }) => ($active ? theme.terracotta : theme.white)};
    color: ${({ $active, theme }) => ($active ? theme.white : theme.brown)};
    border-color: ${({ $active }) => ($active ? 'transparent' : undefined)};

    &:hover {
      background: ${({ $active, theme }) => ($active ? theme.terracotta : theme.white)};
      color: ${({ $active, theme }) => ($active ? theme.white : theme.brown)};
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export default AccountNav;
