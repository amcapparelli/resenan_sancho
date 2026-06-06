import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

type Variant = 'writer' | 'reviewer';

interface HeroCardProps {
  variant: Variant;
}

const CARD_CONTENT: Record<Variant, {
  label: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}> = {
  writer: {
    label: 'SOY ESCRITOR',
    title: 'Quiero reseñas para mi libro',
    description:
      'Encuentra reseñadores que encajan con tu género literario y solicita reseñas directamente.',
    buttonText: 'Buscar reseñadores →',
    href: '/reviewers',
  },
  reviewer: {
    label: 'SOY RESEÑADOR',
    title: 'Quiero descubrir libros nuevos',
    description:
      'Filtra por género y formato. Pide ejemplares gratuitos de libros que te interesen reseñar.',
    buttonText: 'Ver libros disponibles →',
    href: '/books',
  },
};

const HeroCard: React.FC<HeroCardProps> = ({ variant }) => {
  const { label, title, description, buttonText, href } = CARD_CONTENT[variant];

  return (
    <StyledCard variant={variant}>
      <StyledLabel variant={variant}>{label}</StyledLabel>
      <StyledTitle variant={variant}>{title}</StyledTitle>
      <StyledDescription variant={variant}>{description}</StyledDescription>
      <StyledButton href={href} aria-label={buttonText}>
        {buttonText}
      </StyledButton>
    </StyledCard>
  );
};

const StyledCard = styled.article<{ variant: Variant }>`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 22px 20px 20px;
  background-color: ${({ variant, theme }) =>
    variant === 'writer' ? theme.terracotta : theme.ink};
`;

const StyledLabel = styled.span<{ variant: Variant }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ variant }) => (variant === 'writer' ? '#f7d8c8' : '#a89880')};
  margin-bottom: 8px;
`;

const StyledTitle = styled.h2<{ variant: Variant }>`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 1.25;
  color: ${({ variant, theme }) =>
    variant === 'writer' ? theme.white : theme.cream};
  margin: 0 0 10px 0;
`;

/* flex: 1 guarantees the description fills remaining space so the button
   always aligns to the card bottom regardless of text length. */
const StyledDescription = styled.p<{ variant: Variant }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: ${({ variant }) => (variant === 'writer' ? '#f7d8c8' : '#c2b49e')};
  margin: 0 0 20px 0;
  flex: 1;
`;

const StyledButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  min-height: 44px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.ink};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
    background-color: ${({ theme }) => theme.amber};
  }
`;

export default HeroCard;
