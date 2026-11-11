import React from 'react';
import styled from 'styled-components';
import { fieldBase } from '../../../components/styles';

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
  // Non-blocking heads-up, distinct from `error`: same "⚠ + text" shape but
  // in terracotta and without the red border/`$hasError` styling, since it
  // doesn't stop the form from being saved (e.g. an old Amazon link that's
  // no longer valid but was saved before this validation existed).
  warning?: string;
  className?: string;
  // Defaults to `name`; pass explicitly when several fields share a name
  // attribute (e.g. repeated "url"/"name" inputs across channel rows).
  id?: string;
  placeholder?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const AccountField = React.forwardRef<HTMLInputElement, AccountFieldProps>(({
  label,
  name,
  value,
  onChange,
  type = 'text',
  disabled = false,
  required = false,
  note,
  error,
  warning,
  className,
  id,
  placeholder,
  onBlur,
}, ref) => {
  // Derived from the field id, not from `name`: sibling rows can repeat `name`
  // (see the `id` prop above), and duplicated ids would point every field's
  // aria-describedby at the same node.
  const fieldId = id ?? name;
  const noteId = note ? `${fieldId}-note` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const warningId = !error && warning ? `${fieldId}-warning` : undefined;

  return (
    <FieldWrapper className={className}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input
        ref={ref}
        id={fieldId}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        $hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={[noteId, errorId, warningId].filter(Boolean).join(' ') || undefined}
      />
      {note && <FieldNote id={noteId}>{note}</FieldNote>}
      {error && (
        <FieldError id={errorId}>
          <span aria-hidden="true">⚠</span>
          {error}
        </FieldError>
      )}
      {!error && warning && (
        <FieldWarning id={warningId}>
          <span aria-hidden="true">⚠</span>
          {warning}
        </FieldWarning>
      )}
    </FieldWrapper>
  );
});

AccountField.displayName = 'AccountField';

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

export const FieldWarning = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.terracotta};
  margin: 6px 0 0;
`;

const Input = styled.input<{ $hasError: boolean }>`
  ${fieldBase}
  ${({ $hasError, theme }) => $hasError && `border-color: ${theme.danger};`}
`;

export default AccountField;
