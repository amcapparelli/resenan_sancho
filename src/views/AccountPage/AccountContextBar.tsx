import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

interface AccountContextBarProps {
  userName?: string;
}

const BackArrow: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const AccountContextBar: React.FC<AccountContextBarProps> = ({ userName }) => (
  <Bar>
    <Link href="/">
      <BackLink>
        <BackArrow />
        Volver a la web
      </BackLink>
    </Link>
    {userName && <Greeting>{`Hola, ${userName}`}</Greeting>}
  </Bar>
);

const Bar = styled.div`
  background: ${({ theme }) => theme.white};
  padding: 12px 28px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 480px) {
    padding: 10px 16px;
  }
`;

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.terracotta};
  }
`;

const Greeting = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default AccountContextBar;
