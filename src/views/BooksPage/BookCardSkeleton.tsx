import React from 'react';
import styled from 'styled-components';
import { shimmer } from '../../utils/shimmer';

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
`;

const CoverSkeleton = styled(SkeletonBlock)`
  aspect-ratio: 3 / 4;
  width: 100%;
  border-radius: 0;
`;

const Body = styled.div`
  padding: 16px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const TitleSkeleton = styled(SkeletonBlock)`
  height: 18px;
  width: 85%;
`;

const TitleSkeletonSecondLine = styled(SkeletonBlock)`
  height: 18px;
  width: 60%;
`;

const AuthorSkeleton = styled(SkeletonBlock)`
  height: 14px;
  width: 55%;
`;

const Divider = styled.hr`
  border: none;
  border-top: 0.5px solid #e8dfc8;
  margin: 0;
`;

const SynopsisLine = styled(SkeletonBlock)<{ width: string }>`
  height: 13px;
  width: ${({ width }) => width};
`;

const ChipSkeleton = styled(SkeletonBlock)`
  height: 20px;
  width: 52px;
  border-radius: 4px;
`;

const MetaSkeleton = styled(SkeletonBlock)`
  height: 13px;
  width: 45%;
`;

const CTASkeleton = styled(SkeletonBlock)`
  height: 44px;
  border-radius: 8px;
  margin-top: auto;
`;

const BookCardSkeleton: React.FC = () => (
  <Card aria-hidden="true">
    <CoverSkeleton />
    <Body>
      <TitleSkeleton />
      <TitleSkeletonSecondLine />
      <AuthorSkeleton />
      <Divider />
      <SynopsisLine width="100%" />
      <SynopsisLine width="92%" />
      <SynopsisLine width="96%" />
      <SynopsisLine width="75%" />
      <Divider />
      <div style={{ display: 'flex', gap: 5 }}>
        <ChipSkeleton />
        <ChipSkeleton />
      </div>
      <MetaSkeleton />
      <Divider />
      <CTASkeleton />
    </Body>
  </Card>
);

export default BookCardSkeleton;
