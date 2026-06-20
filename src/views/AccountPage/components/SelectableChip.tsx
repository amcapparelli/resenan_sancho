import React from 'react';
import styled from 'styled-components';

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

// Visually a pill, semantically a checkbox. The selection is reinforced with a
// check glyph (not color alone) per the accessibility spec.
const SelectableChip: React.FC<SelectableChipProps> = ({ label, selected, onToggle }) => (
  <Chip $selected={selected}>
    <HiddenCheckbox type="checkbox" checked={selected} onChange={onToggle} />
    {selected && <Check aria-hidden="true">✓</Check>}
    {label}
  </Chip>
);

const Chip = styled.label<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 7px 14px;
  min-height: 40px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.terracotta : theme.lightBorder)};
  background: ${({ $selected, theme }) => ($selected ? theme.cream : theme.white)};
  color: ${({ $selected, theme }) => ($selected ? theme.brown : theme.ink)};
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  transition: border-color 0.15s ease, background 0.15s ease;

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(199, 91, 34, 0.25);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const HiddenCheckbox = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const Check = styled.span`
  font-size: 12px;
  line-height: 1;
`;

export default SelectableChip;
