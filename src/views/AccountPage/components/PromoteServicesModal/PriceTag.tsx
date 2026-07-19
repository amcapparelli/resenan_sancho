import React from 'react';
import styled from 'styled-components';
import formatPriceCents from '../../../../utils/formatPriceCents';

interface PriceTagProps {
  priceCents: number;
  /** Free services show "Gratis" in success green instead of the amount. */
  free?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({ priceCents, free = false }) => (
  <Wrapper>
    <Amount $free={free}>
      {free ? 'Gratis' : formatPriceCents(priceCents)}
    </Amount>
    <Caption>{free ? 'una vez por libro' : 'pago único'}</Caption>
  </Wrapper>
);

const Wrapper = styled.div`
  text-align: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e8dfc8;
`;

const Amount = styled.p<{ $free: boolean }>`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: ${({ $free }) => ($free ? '22px' : '26px')};
  line-height: 1.1;
  color: ${({ $free, theme }) => ($free ? theme.successDark : theme.terracotta)};
  margin: 0;
`;

// `brown` rather than `muted` (3.3:1, below AA): whether a service is a one-off
// payment or a once-per-book freebie is information people decide with.
const Caption = styled.span`
  display: block;
  margin-top: 2px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  color: ${({ theme }) => theme.brown};
`;

export default PriceTag;
