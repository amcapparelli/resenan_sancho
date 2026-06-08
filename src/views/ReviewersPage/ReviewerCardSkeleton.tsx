import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const shimmerAnimation = keyframes`
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
`;

// The shimmer gradient — reduced-motion users get a static fallback
const shimmer = css`
  background: linear-gradient(
    90deg,
    #ede3cb 25%,
    #f5edda 50%,
    #ede3cb 75%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: #ede3cb;
  }
`;

const SkeletonBlock = styled.div`
  ${shimmer}
  border-radius: 4px;
`;

const Card = styled.div`
  background: #f5edda;
  border: 1px solid #e8dfc8;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

// Avatar placeholder
const AvatarSkeleton = styled(SkeletonBlock)`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  flex-shrink: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 14px;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  padding-top: 4px;
`;

const NameSkeleton = styled(SkeletonBlock)`
  height: 16px;
  width: 65%;
`;

const Divider = styled.hr`
  border: none;
  border-top: 0.5px solid #e8dfc8;
  margin: 0 -20px;
  padding: 12px 20px 0;
`;

// Description occupies 3 lines of fixed height
const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
  flex: 1;
`;

const DescLine = styled(SkeletonBlock)<{ width: string }>`
  height: 13px;
  width: ${({ width }) => width};
`;

const SectionLabel = styled(SkeletonBlock)`
  height: 10px;
  width: 40%;
  margin-bottom: 8px;
`;

const ChipsRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const ChipSkeleton = styled(SkeletonBlock)`
  height: 22px;
  width: 64px;
  border-radius: 6px;
`;

const SectionWrapper = styled.div`
  margin: 0 -20px;
  padding: 12px 20px 0;
  border-top: 0.5px solid #e8dfc8;
`;

const ReviewerCardSkeleton: React.FC = () => (
  <Card aria-hidden="true">
    <HeaderRow>
      <AvatarSkeleton />
      <NameBlock>
        <NameSkeleton />
      </NameBlock>
    </HeaderRow>

    <DescriptionBlock>
      <DescLine width="100%" />
      <DescLine width="92%" />
      <DescLine width="96%" />
    </DescriptionBlock>

    <SectionWrapper>
      <SectionLabel />
      <ChipsRow>
        <ChipSkeleton />
        <ChipSkeleton />
      </ChipsRow>
    </SectionWrapper>

    <SectionWrapper>
      <SectionLabel />
      <ChipsRow>
        <ChipSkeleton />
        <ChipSkeleton />
        <ChipSkeleton />
      </ChipsRow>
    </SectionWrapper>

    <SectionWrapper>
      <SectionLabel />
      <ChipsRow>
        <ChipSkeleton />
        <ChipSkeleton />
      </ChipsRow>
    </SectionWrapper>
  </Card>
);

export default ReviewerCardSkeleton;
