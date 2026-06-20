import React from 'react';
import styled from 'styled-components';
import { shimmer } from '../../../utils/shimmer';

const Block = styled.div`
  ${shimmer}
  border-radius: 4px;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;
`;

const Cover = styled(Block)`
  width: 56px;
  height: 75px;
  border-radius: 6px;
  flex-shrink: 0;
`;

const Lines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 4px;
`;

const TitleLine = styled(Block)`
  height: 16px;
  width: 60%;
`;

const MetaLine = styled(Block)`
  height: 12px;
  width: 40%;
`;

const StatusLine = styled(Block)`
  height: 12px;
  width: 30%;
`;

const ButtonBlock = styled(Block)`
  height: 44px;
  width: 120px;
  border-radius: 8px;
  flex-shrink: 0;
`;

const SkeletonRow: React.FC = () => (
  <Row aria-hidden="true">
    <Cover />
    <Lines>
      <TitleLine />
      <MetaLine />
      <StatusLine />
    </Lines>
    <ButtonBlock />
  </Row>
);

const MyBooksSkeleton: React.FC = () => (
  <div aria-hidden="true">
    <SkeletonRow />
    <SkeletonRow />
    <SkeletonRow />
  </div>
);

export default MyBooksSkeleton;
