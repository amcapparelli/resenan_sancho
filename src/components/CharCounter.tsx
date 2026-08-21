import React from 'react';
import styled from 'styled-components';

interface CharCounterProps {
  value: number;
  max: number;
}

const CharCounter: React.FC<CharCounterProps> = ({ value, max }) => (
  <Counter $warn={value >= max * 0.9}>{`${value} / ${max}`}</Counter>
);

const Counter = styled.span<{ $warn: boolean }>`
  display: block;
  text-align: right;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: ${({ $warn, theme }) => ($warn ? theme.terracotta : theme.muted)};
`;

export default CharCounter;
