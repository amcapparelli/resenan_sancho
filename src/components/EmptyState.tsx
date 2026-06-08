import React from 'react';
import styled from 'styled-components';

interface EmptyStateProps {
  title?: string;
  subtitle: string;
  icon: React.ReactNode;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 28px;
  text-align: center;
  gap: 12px;
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.4;
`;

const Title = styled.h2`
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
  margin: 0;
`;

const Subtitle = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.brown};
  margin: 0;
`;

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Sin resultados',
  subtitle,
  icon,
}) => (
  <Wrapper>
    <IconWrapper>{icon}</IconWrapper>
    <Title>{title}</Title>
    <Subtitle>{subtitle}</Subtitle>
  </Wrapper>
);

export default EmptyState;
