import React from 'react';
import styled from 'styled-components';
import CharCounter from '../CharCounter';
import { fieldBase } from '../styles';

export const MESSAGE_MAX_LENGTH = 2000;

interface MessageFieldProps {
  id: string;
  value: string;
  /** Author's first name, already resolved by the caller. */
  authorName: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}

const MessageField: React.FC<MessageFieldProps> = ({
  id,
  value,
  authorName,
  disabled = false,
  onChange,
}) => {
  const helpId = `${id}-help`;

  return (
    <Field>
      <Label htmlFor={id}>{`Tu mensaje para ${authorName}`}</Label>
      <Help id={helpId}>
        Preséntate y cuéntale qué te ha llamado la atención del libro. Si tu blog
        o canal no aparece aún en tu perfil, menciónalo aquí.
      </Help>
      <Textarea
        id={id}
        name="message"
        value={value}
        maxLength={MESSAGE_MAX_LENGTH}
        disabled={disabled}
        aria-describedby={helpId}
        placeholder={`Hola ${authorName}, soy… y escribo reseñas en… Me interesa tu libro porque…`}
        onChange={({ target }) => onChange(target.value)}
      />
      <CounterRow>
        <CharCounter value={value.length} max={MESSAGE_MAX_LENGTH} />
      </CounterRow>
    </Field>
  );
};

const Field = styled.div`
  margin-bottom: 18px;
`;

const CounterRow = styled.div`
  margin-top: 6px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.brown};
`;

const Help = styled.p`
  margin: 0 0 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.muted};
`;

const Textarea = styled.textarea`
  ${fieldBase}
  min-height: 130px;
  padding: 12px 14px;
  line-height: 1.6;
  resize: vertical;
`;

export default MessageField;
