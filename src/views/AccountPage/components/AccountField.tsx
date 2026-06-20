import React from 'react';
import styled from 'styled-components';
import { fieldBase } from './styles';

interface AccountFieldProps {
  label: string;
  name: string;
  value: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  note?: string;
  error?: string;
  className?: string;
}

const AccountField: React.FC<AccountFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  note,
  error,
  className,
}) => (
  <FieldWrapper className={className}>
    <FieldLabel htmlFor={name}>{label}</FieldLabel>
    <Input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      $hasError={!!error}
      aria-invalid={!!error}
    />
    {note && <FieldNote>{note}</FieldNote>}
    {error && (
      <FieldError>
        <span aria-hidden="true">⚠</span>
        {error}
      </FieldError>
    )}
  </FieldWrapper>
);

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FieldLabel = styled.label`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.brown};
  margin-bottom: 6px;
`;

export const FieldNote = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: #9a8c7e;
  margin: 6px 0 0;
`;

export const FieldError = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: #DE4A10;
  margin: 6px 0 0;
`;

const Input = styled.input<{ $hasError: boolean }>`
  ${fieldBase}
  ${({ $hasError }) => $hasError && 'border-color: #DE4A10;'}
`;

export default AccountField;
