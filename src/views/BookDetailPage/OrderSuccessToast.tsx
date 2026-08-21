import React from 'react';
import styled from 'styled-components';
import { CheckIcon } from '../../components/icons';

interface OrderSuccessToastProps {
  visible: boolean;
}

/**
 * Confirmation shown after a copy request goes through. The live region is
 * always in the tree — assistive tech only announces content added to a region
 * that already existed — and only the banner inside it comes and goes.
 * Same visual language as the account area's success banner (SaveBar).
 */
const OrderSuccessToast: React.FC<OrderSuccessToastProps> = ({ visible }) => (
  <Region role="status" aria-live="polite">
    {visible && (
      <Banner>
        <CheckIcon />
        <span>Mensaje enviado</span>
      </Banner>
    )}
  </Region>
);

const Region = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1400;

  &:empty {
    display: none;
  }
`;

const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 8px;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.success};
  box-shadow: 0 6px 20px rgba(61, 58, 53, 0.2);
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};
`;

export default OrderSuccessToast;
