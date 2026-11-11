import React from 'react';
import styled from 'styled-components';
import HeroStrip, { HERO_COLUMNS } from './HeroStrip';
import SocialProof from './SocialProof';

// One strip per audience, with the same visual weight. The writer strip keeps
// the page's only h1; the reviewer strip hangs from it as an h2. DOM order is
// writer → reviewer: stacked on mobile, left → right on desktop.
const HeroSection: React.FC = () => (
  <>
    <StyledHero>
      <HeroStrip
        headingLevel="h1"
        lead="Que hablen de"
        accent="tu libro."
        tagline="Un libro sin reseñas es un libro aún sin publicar."
        cardVariant="writer"
      />
      <StyledReviewerStrip
        headingLevel="h2"
        lead="Que descubran"
        accent="tus reseñas literarias."
        tagline="Colabora con autores y editoriales."
        cardVariant="reviewer"
      />
    </StyledHero>

    <SocialProof />
  </>
);

/* Cream behind both strips so, while stacked, the reviewer strip's rounded top
   corners reveal the writer strip's colour: a soft "tab" between audiences.
   On desktop the grid's default stretch makes both columns equally tall, which
   is what lets each card sit at the same height at the bottom of its column. */
const StyledHero = styled.div`
  background-color: ${({ theme }) => theme.cream};

  ${HERO_COLUMNS} {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

/* Side by side, the tab no longer reads as one strip tucked under another: a
   rounded top-left corner would only nick the corner next to the header. The
   colour change alone splits the two halves, so the corners go square. */
const StyledReviewerStrip = styled(HeroStrip)`
  background-color: ${({ theme }) => theme.sand};
  border-radius: 24px 24px 0 0;

  @media (min-width: 768px) {
    border-radius: 40px 40px 0 0;
  }

  ${HERO_COLUMNS} {
    border-radius: 0;
  }
`;

export default HeroSection;
