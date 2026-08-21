import React from 'react';
import styled from 'styled-components';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * Consent to hand the reviewer's email over to the author. The wording is the
 * legal text already in production and must not be reworded.
 */
const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({
  id,
  checked,
  disabled = false,
  onChange,
}) => (
  <Row>
    <Checkbox
      id={id}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={({ target }) => onChange(target.checked)}
    />
    <Label htmlFor={id}>
      Al enviar el mensaje le facilitaremos tu email al autor para que se ponga en
      contacto contigo. Marca esta casilla si estás de acuerdo.
    </Label>
  </Row>
);

/* padding + the two-line label take the clickable row past the 44px touch
   target, even though the checkbox itself is only 18px. */
const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-height: 44px;
  padding: 14px;
  background: ${({ theme }) => theme.appBackground};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin: 0;
  accent-color: ${({ theme }) => theme.terracotta};
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12.5px;
  line-height: 1.55;
  color: #5a524a;
  cursor: pointer;
`;

export default ConsentCheckbox;
