import React from 'react';
import styled from 'styled-components';
import { CHEVRON_SVG } from '../../../utils/selectChevron';
import { fieldBase } from './styles';
import {
  FieldWrapper,
  FieldLabel,
  FieldNote,
  FieldError,
} from './AccountField';

interface Option {
  value: string;
  label: string;
}

interface AccountSelectProps {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  note?: string;
  error?: string;
  className?: string;
}

const AccountSelect: React.FC<AccountSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = '—',
  note,
  error,
  className,
}) => {
  // Without these, a screen reader announces "invalid" (or nothing at all for a
  // plain note) with no clue about why — and for the country field the note
  // carries the actual instruction.
  const noteId = note ? `${name}-note` : undefined;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <FieldWrapper className={className}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Select
        id={name}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        $hasError={!!error}
        aria-invalid={!!error}
        aria-describedby={[noteId, errorId].filter(Boolean).join(' ') || undefined}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Select>
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

const Select = styled.select<{ $hasError: boolean }>`
  ${fieldBase}
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  padding-right: 36px;
  background-image: ${CHEVRON_SVG};
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  ${({ $hasError, theme }) => $hasError && `border-color: ${theme.danger};`}
`;

export default AccountSelect;
