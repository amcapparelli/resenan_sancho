import React from 'react';
import styled from 'styled-components';
import HeroCard from './HeroCard';
import SocialProof from './SocialProof';

const HeroSection: React.FC = () => (
  <>
    <StyledHero>
      <StyledHeadline>
        Qué hablen de{' '}
        {/* font-style: normal evita que el <em> semántico italice el texto */}
        <StyledAccent>tu libro.</StyledAccent>
      </StyledHeadline>

      <StyledTagline>
        Un libro sin reseñas es un libro aún sin publicar.
      </StyledTagline>

      <StyledCardsGrid>
        <HeroCard variant="writer" />
        <HeroCard variant="reviewer" />
      </StyledCardsGrid>
    </StyledHero>

    <SocialProof />
  </>
);

const StyledHero = styled.section`
  background-color: ${({ theme }) => theme.cream};
  padding: 36px 20px;
  text-align: center;

  @media (min-width: 480px) {
    padding: 52px 28px 48px;
  }
`;

const StyledHeadline = styled.h1`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.12;
  color: ${({ theme }) => theme.ink};
  margin: 0 0 16px 0;

  @media (min-width: 480px) {
    font-size: 42px;
  }
`;

const StyledAccent = styled.em`
  font-style: normal;
  color: ${({ theme }) => theme.terracotta};
`;

const StyledTagline = styled.p`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.brown};
  max-width: 420px;
  margin: 0 auto 40px;

  @media (min-width: 480px) {
    font-size: 18px;
  }
`;

const StyledCardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  max-width: 540px;
  margin: 0 auto;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export default HeroSection;
