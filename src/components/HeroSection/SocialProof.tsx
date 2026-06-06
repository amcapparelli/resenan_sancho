import React from 'react';
import styled from 'styled-components';

interface Stat {
  value: string;
  label: string;
}

const STATS: [Stat, Stat] = [
  { value: '350+', label: 'Libros disponibles' },
  { value: '475', label: 'Reseñadores activos' },
];

const SocialProof: React.FC = () => (
  <StyledWrapper>
    {STATS.map((stat, index) => (
      <StyledCell key={stat.label} isFirst={index === 0}>
        <StyledValue>{stat.value}</StyledValue>
        <StyledLabel>{stat.label}</StyledLabel>
      </StyledCell>
    ))}
  </StyledWrapper>
);

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: ${({ theme }) => theme.white};
  border-top: 0.5px solid ${({ theme }) => theme.lightBorder};
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};
`;

const StyledCell = styled.div<{ isFirst: boolean }>`
  padding: 22px 16px;
  text-align: center;
  border-right: ${({ isFirst, theme }) =>
    isFirst ? `0.5px solid ${theme.lightBorder}` : 'none'};
`;

const StyledValue = styled.p`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 30px;
  color: ${({ theme }) => theme.terracotta};
  margin: 0;
`;

const StyledLabel = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  margin: 3px 0 0 0;
`;

export default SocialProof;
