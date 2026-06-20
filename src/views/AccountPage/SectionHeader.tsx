import React from 'react';
import styled from 'styled-components';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <Wrapper>
    <Title>{title}</Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </Wrapper>
);

const Wrapper = styled.div`
  margin-bottom: 22px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid #e8dfc8;
`;

const Title = styled.h1`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 22px;
  color: ${({ theme }) => theme.ink};
  margin: 0;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.brown};
  margin: 4px 0 0;
`;

export default SectionHeader;
