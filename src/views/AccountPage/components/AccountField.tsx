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
  // Defaults to `name`; pass explicitly when several fields share a name
  // attribute (e.g. repeated "url"/"name" inputs across channel rows).
  id?: string;
  placeholder?: string;
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
  id,
  placeholder,
}) => {
  // Derived from the field id, not from `name`: sibling rows can repeat `name`
  // (see the `id` prop above), and duplicated ids would point every field's
  // aria-describedby at the same node.
  const fieldId = id ?? name;
  const noteId = note ? `${fieldId}-note` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <FieldWrapper className={className}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input
        id={fieldId}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        $hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={[noteId, errorId].filter(Boolean).join(' ') || undefined}
      />
      {note && <FieldNote id={noteId}>{note}</FieldNote>}
      {error && (
        <FieldError id={errorId}>
          <span aria-hidden="true">⚠</span>
          {error}
        </FieldError>
      )}
    </FieldWrapper>
  );
};

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
  color: ${({ theme }) => theme.muted};
  margin: 6px 0 0;
`;

export const FieldError = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.danger};
  margin: 6px 0 0;
`;

const Input = styled.input<{ $hasError: boolean }>`
  ${fieldBase}
  ${({ $hasError, theme }) => $hasError && `border-color: ${theme.danger};`}
`;

export default AccountField;
