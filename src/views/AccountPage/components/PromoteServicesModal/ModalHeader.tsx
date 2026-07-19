import React from 'react';
import styled from 'styled-components';
import formatAvailableCopies from '../../../../utils/formatAvailableCopies';
import { BookIcon, CloseIcon } from './icons';

interface ModalHeaderProps {
  titleId: string;
  title: string;
  coverUrl?: string;
  availableCopies: number;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({
  titleId,
  title,
  coverUrl,
  availableCopies,
  onClose,
}) => {
  const hasCopies = availableCopies > 0;

  return (
    <Header>
      {coverUrl
        ? <Cover src={coverUrl} alt={`Portada de ${title}`} />
        : <CoverFallback aria-hidden="true"><BookIcon /></CoverFallback>}

      <Info>
        <Eyebrow>Promociona este libro</Eyebrow>
        <Title id={titleId}>{title}</Title>
        <Status>
          <Dot $ok={hasCopies} aria-hidden="true">●</Dot>
          {/* Never colour alone: the sentence itself states the situation. */}
          <StatusText $ok={hasCopies}>
            {hasCopies
              ? formatAvailableCopies(availableCopies)
              : 'Sin ejemplares · ahora nadie puede pedirte este libro'}
          </StatusText>
        </Status>
      </Info>

      <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
        <CloseIcon />
      </CloseButton>
    </Header>
  );
};

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 22px;
  background: ${({ theme }) => theme.cream};
  border-bottom: 1px solid ${({ theme }) => theme.lightBorder};

  @media (max-width: 559px) {
    padding: 14px 16px;
    gap: 12px;
  }
`;

const Cover = styled.img`
  width: 56px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 6px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(61, 58, 53, 0.18);

  @media (max-width: 559px) {
    width: 44px;
    height: 58px;
  }
`;

const CoverFallback = styled.div`
  width: 56px;
  height: 75px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: #efe5c8;
  color: ${({ theme }) => theme.lightBorder};

  @media (max-width: 559px) {
    width: 44px;
    height: 58px;
  }
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Eyebrow = styled.p`
  margin: 0 0 2px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.brown};
`;

const Title = styled.h2`
  margin: 0 0 6px;
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.2;
  color: ${({ theme }) => theme.ink};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 559px) {
    font-size: 17px;
  }
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Dot = styled.span<{ $ok: boolean }>`
  font-size: 8px;
  line-height: 1;
  color: ${({ $ok, theme }) => ($ok ? theme.success : theme.terracotta)};
`;

const StatusText = styled.span<{ $ok: boolean }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $ok, theme }) => ($ok ? theme.brown : theme.terracotta)};
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: none;
  cursor: pointer;
  color: ${({ theme }) => theme.ink};

  &:hover {
    background: #efe5c8;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.ink};
    outline-offset: 2px;
  }
`;

export default ModalHeader;
