import React, { useId } from 'react';
import styled from 'styled-components';
import HeadingAccent from '../HeadingAccent';
import HeroCard, { HeroCardVariant } from './HeroCard';

interface HeroStripProps {
  headingLevel: 'h1' | 'h2';
  /** Headline text before the accented part (a trailing space is added). */
  lead: string;
  accent: string;
  tagline: string;
  cardVariant: HeroCardVariant;
  /** Lets the parent add page-level chrome (background, separators). */
  className?: string;
}

const HeroStrip: React.FC<HeroStripProps> = ({
  headingLevel,
  lead,
  accent,
  tagline,
  cardVariant,
  className,
}) => {
  // Ties the section's aria-labelledby to its headline without the caller
  // having to pick a unique id per strip.
  const headingId = useId();

  return (
    <StyledSection aria-labelledby={headingId} className={className}>
      <StyledInner>
        <StyledText>
          <StyledHeadline as={headingLevel} id={headingId} $isPageTitle={headingLevel === 'h1'}>
            {lead}{' '}
            <HeadingAccent>{accent}</HeadingAccent>
          </StyledHeadline>
          <StyledTagline>{tagline}</StyledTagline>
        </StyledText>

        <StyledCardSlot>
          <HeroCard variant={cardVariant} />
        </StyledCardSlot>
      </StyledInner>
    </StyledSection>
  );
};

const TABLET = '@media (min-width: 768px)';

/**
 * From this width the hero splits into two side-by-side columns (one strip
 * each). 1024 rather than 768: at 768 each half leaves ~320px of content, so
 * the 42px h1 and the 36px h2 break into three or four lines and the 320px
 * card fills the whole column. Below it, both strips stay stacked as on mobile.
 */
export const HERO_COLUMNS = '@media (min-width: 1024px)';

const StyledSection = styled.section`
  padding: 36px 20px 40px;

  @media (min-width: 480px) {
    padding: 52px 28px 48px;
  }

  ${TABLET} {
    padding: 64px 32px;
  }

  /* Column so the inner wrapper can stretch to the height of the taller
     strip (the parent grid makes both strips equally tall). */
  ${HERO_COLUMNS} {
    display: flex;
    flex-direction: column;
  }
`;

const StyledInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  max-width: 880px;
  margin: 0 auto;

  /* Each strip is only half the viewport here; the cap keeps the headline
     and card together instead of drifting apart on wide screens. */
  ${HERO_COLUMNS} {
    flex: 1;
    max-width: 440px;
  }
`;

const StyledText = styled.div`
  text-align: center;

  ${HERO_COLUMNS} {
    text-align: left;
  }
`;

const StyledHeadline = styled.h1<{ $isPageTitle: boolean }>`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: ${({ $isPageTitle }) => ($isPageTitle ? '28px' : '26px')};
  line-height: 1.12;
  color: ${({ theme }) => theme.ink};
  margin: 0 0 16px 0;

  @media (min-width: 480px) {
    font-size: ${({ $isPageTitle }) => ($isPageTitle ? '42px' : '36px')};
  }
`;

const StyledTagline = styled.p`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.brown};
  max-width: 420px;
  margin: 0 auto;

  @media (min-width: 480px) {
    font-size: 18px;
  }

  ${HERO_COLUMNS} {
    margin: 0;
  }
`;

/* The card stands alone in its strip: cap its width so it reads as a card
   rather than a full-width banner. */
const StyledCardSlot = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;

  /* margin-top: auto pins the card to the bottom of its (equal-height) strip,
     so both cards line up even when the headlines wrap to different lines. */
  ${HERO_COLUMNS} {
    margin: auto 0 0;
  }
`;

export default HeroStrip;
