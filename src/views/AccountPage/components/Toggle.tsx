import React from 'react';
import styled from 'styled-components';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  ariaControls?: string;
  // When the switch already has a visible text label, pass its id here so the
  // accessible name comes from that single source instead of duplicating copy.
  labelledBy?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  ariaControls,
  labelledBy,
}) => (
  <Track $checked={checked}>
    <HiddenCheckbox
      type="checkbox"
      role="switch"
      checked={checked}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-checked={checked}
      aria-expanded={ariaControls ? checked : undefined}
      aria-controls={ariaControls}
      onChange={(e) => onChange(e.target.checked)}
    />
    <Knob $checked={checked} />
  </Track>
);

const Track = styled.label<{ $checked: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 24px;
  border-radius: 999px;
  cursor: pointer;
  flex-shrink: 0;
  background: ${({ $checked, theme }) => ($checked ? theme.terracotta : theme.lightBorder)};
  transition: background 0.15s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(199, 91, 34, 0.25);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
`;

const Knob = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.white};
  transform: translateX(${({ $checked }) => ($checked ? '20px' : '0')});
  transition: transform 0.15s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export default Toggle;
