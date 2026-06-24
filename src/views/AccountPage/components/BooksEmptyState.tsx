import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const BookIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const BooksEmptyState: React.FC = (): JSX.Element => (
  <Wrapper>
    <IconHolder>
      <BookIcon />
    </IconHolder>
    <Title>Aún no has publicado ningún libro</Title>
    <Text>Publica tu primer libro para empezar a buscar reseñas.</Text>
    <PrimaryButton href="/account?section=addBook">
      + Añadir mi primer libro
    </PrimaryButton>
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 20px;
`;

const IconHolder = styled.div`
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.4;
  margin-bottom: 12px;
`;

const Title = styled.p`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 20px;
  color: ${({ theme }) => theme.ink};
  margin: 0 0 6px;
`;

const Text = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.brown};
  margin: 0 0 20px;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.terracotta};
  color: ${({ theme }) => theme.white};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 11px 22px;
  min-height: 44px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #a84a1b;
  }
`;

export default BooksEmptyState;
