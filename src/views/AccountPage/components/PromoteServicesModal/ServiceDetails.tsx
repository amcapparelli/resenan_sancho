import React, { useId, useState } from 'react';
import styled from 'styled-components';
import { ChevronIcon } from './icons';

interface ServiceDetailsProps {
  /** Service name, only used to disambiguate the accessible name of the trigger. */
  serviceName: string;
  details: string;
}

/**
 * "Cómo funciona" disclosure. Each card owns its own open state on purpose:
 * this is not an exclusive accordion, people compare services side by side and
 * want several panels open at once.
 */
const ServiceDetails: React.FC<ServiceDetailsProps> = ({ serviceName, details }) => {
  const [open, setOpen] = useState(false);
  const panelId = `${useId()}-details`;

  return (
    <Wrapper>
      <Trigger
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        // Four identical "Cómo funciona" triggers share the screen.
        aria-label={`Cómo funciona: ${serviceName}`}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        Cómo funciona
        <ChevronHolder $open={open}><ChevronIcon /></ChevronHolder>
      </Trigger>
      <Panel id={panelId} hidden={!open}>{details}</Panel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  align-self: start;
  width: 100%;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  min-height: 32px;
  padding: 4px 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.brown};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.ink};
    outline-offset: 2px;
    border-radius: 6px;
  }

  @media (max-width: 899px) {
    min-height: 44px;
  }
`;

const ChevronHolder = styled.span<{ $open: boolean }>`
  display: inline-flex;
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Panel = styled.div`
  margin-top: 8px;
  padding: 11px 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.cream};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.55;
  color: #5a524a;
  text-align: left;

  &[hidden] {
    display: none;
  }
`;

export default ServiceDetails;
