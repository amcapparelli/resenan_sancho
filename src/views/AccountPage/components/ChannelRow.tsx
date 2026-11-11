import React from 'react';
import styled from 'styled-components';
import AccountField from './AccountField';
import Toggle from './Toggle';

interface ChannelRowProps {
  channelKey: string;
  label: string;
  Icon: React.FC<{ size?: number }>;
  selected: boolean;
  url: string;
  name: string;
  // Optional per-channel hints (e.g. TikTok's `@tuusuario`); omitted for the
  // original channels, which keep empty fields.
  namePlaceholder?: string;
  urlPlaceholder?: string;
  errors: { url?: string; name?: string };
  // Non-blocking heads-up for the URL field only (currently Amazon-only,
  // see `AccountField`'s `warning` prop).
  urlWarning?: string;
  onToggle: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // Fires on blur of the URL field only; lets a channel run validation
  // without re-checking on every keystroke (currently Amazon and TikTok).
  onUrlBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  // Lets the parent focus the URL field programmatically when a blocking
  // validation error appears on save (currently Amazon and TikTok).
  urlFieldRef?: React.Ref<HTMLInputElement>;
  // Lets a specific channel (e.g. Amazon's link help panel) inject extra
  // content below the fields without hardcoding per-channel logic here.
  extraContent?: React.ReactNode;
}

const ChannelRow: React.FC<ChannelRowProps> = ({
  channelKey,
  label,
  Icon,
  selected,
  url,
  name,
  namePlaceholder,
  urlPlaceholder,
  errors,
  urlWarning,
  onToggle,
  onChange,
  onUrlBlur,
  urlFieldRef,
  extraContent,
}) => (
  <Row $active={selected}>
    <Head>
      <Channel>
        <IconHolder><Icon size={18} /></IconHolder>
        <ChannelName>{label}</ChannelName>
      </Channel>
      <Toggle
        checked={selected}
        onChange={onToggle}
        label={`Activar ${label}`}
        ariaControls={`${channelKey}-fields`}
      />
    </Head>
    {selected && (
      <Fields id={`${channelKey}-fields`}>
        <AccountField
          label="Nombre del perfil"
          name="name"
          id={`${channelKey}-name`}
          value={name || ''}
          onChange={onChange}
          error={errors.name}
          placeholder={namePlaceholder}
        />
        <AccountField
          ref={urlFieldRef}
          label="URL"
          name="url"
          id={`${channelKey}-url`}
          type="url"
          value={url || ''}
          placeholder={urlPlaceholder}
          onChange={onChange}
          onBlur={onUrlBlur}
          error={errors.url}
          warning={urlWarning}
        />
        {extraContent}
      </Fields>
    )}
  </Row>
);

const Row = styled.div<{ $active: boolean }>`
  border: 1px solid ${({ $active, theme }) => ($active ? theme.amber : theme.lightBorder)};
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.white};
  transition: border-color 0.15s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Channel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.ink};
`;

const IconHolder = styled.span`
  display: inline-flex;
  color: ${({ theme }) => theme.brown};
`;

const ChannelName = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
`;

const Fields = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export default ChannelRow;
