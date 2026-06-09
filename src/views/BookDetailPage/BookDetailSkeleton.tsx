import React from 'react';
import styled, { css, keyframes } from 'styled-components';

// ─── Animation ──────────────────────────────────────────────────────────────

const shimmerAnimation = keyframes`
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
`;

// Shared shimmer style. Reduced-motion users get a static background instead.
const shimmer = css`
  background: linear-gradient(
    90deg,
    #ede3cb 25%,
    #f5edda 50%,
    #ede3cb 75%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite;
  border-radius: 6px;

  @media (prefers-reduced-motion: reduce) {
    background: #ede3cb;
    animation: none;
  }
`;

// ─── Primitives ─────────────────────────────────────────────────────────────

const Block = styled.div<{ width?: string; height?: string }>`
  ${shimmer}
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '16px'};
`;

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

const BreadcrumbBar = styled.div`
  padding: 12px 20px;
  background: ${({ theme }) => theme.white};
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 600px) {
    padding: 14px 28px;
  }
`;

// ─── Hero ────────────────────────────────────────────────────────────────────

const HeroSection = styled.div`
  background: ${({ theme }) => theme.cream};
  padding: 28px 20px 32px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 600px) {
    padding: 40px 28px 44px;
  }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 860px;
  margin: 0 auto;

  @media (min-width: 600px) {
    grid-template-columns: 200px 1fr;
    gap: 28px;
  }

  @media (min-width: 900px) {
    grid-template-columns: 240px 1fr;
    gap: 36px;
  }
`;

// aspect-ratio isn't reliable in older browsers but Next.js 9 targets
// modern evergreen, so this is fine.
const CoverBlock = styled.div`
  ${shimmer}
  width: 100%;
  max-width: 200px;
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  margin: 0 auto;

  @media (min-width: 600px) {
    max-width: 100%;
  }
`;

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MetaChips = styled.div`
  display: flex;
  gap: 8px;
`;

const CTABlock = styled.div`
  ${shimmer}
  height: 80px;
  border-radius: 10px;
`;

// ─── Synopsis ────────────────────────────────────────────────────────────────

const SynopsisSection = styled.div`
  background: ${({ theme }) => theme.white};
  padding: 28px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 600px) {
    padding: 40px 28px;
  }
`;

const SynopsisInner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// ─── Component ───────────────────────────────────────────────────────────────

const BookDetailSkeleton: React.FC = () => (
  <>
    {/* Breadcrumb */}
    <BreadcrumbBar>
      <Block width="120px" height="14px" />
    </BreadcrumbBar>

    {/* Hero */}
    <HeroSection>
      <HeroGrid>
        <CoverBlock />

        <InfoCol>
          {/* Genre badge + format chips */}
          <MetaChips>
            <Block width="70px" height="22px" />
            <Block width="55px" height="22px" />
            <Block width="55px" height="22px" />
          </MetaChips>

          {/* Title */}
          <Block width="90%" height="28px" />
          {/* Author */}
          <Block width="60%" height="18px" />
          {/* Subtitle line */}
          <Block width="40%" height="14px" />

          {/* Metadata */}
          <MetaChips>
            <Block width="100px" height="16px" />
            <Block width="130px" height="16px" />
          </MetaChips>

          {/* CTA card */}
          <CTABlock />
        </InfoCol>
      </HeroGrid>
    </HeroSection>

    {/* Synopsis */}
    <SynopsisSection>
      <SynopsisInner>
        {/* Section header line */}
        <Block width="80px" height="12px" />

        {/* Body lines of variable width */}
        {(['100%', '95%', '88%', '100%', '92%', '85%', '97%', '70%'] as const).map(
          (w, i) => (
            // Index is stable: skeleton lines never reorder
            // eslint-disable-next-line react/no-array-index-key
            <Block key={i} width={w} height="16px" />
          ),
        )}
      </SynopsisInner>
    </SynopsisSection>
  </>
);

export default BookDetailSkeleton;
