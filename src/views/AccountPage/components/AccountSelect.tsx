import React from 'react';
import styled from 'styled-components';
import { CHEVRON_SVG } from '../../../utils/selectChevron';
import { fieldBase } from './styles';
import {
  FieldWrapper,
  FieldLabel,
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
  error,
  className,
}) => (
  <FieldWrapper className={className}>
    <FieldLabel htmlFor={name}>{label}</FieldLabel>
    <Select
      id={name}
      name={name}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      $hasError={!!error}
      aria-invalid={!!error}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </Select>
    {error && (
      <FieldError>
        <span aria-hidden="true">⚠</span>
        {error}
      </FieldError>
    )}
  </FieldWrapper>
);

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
