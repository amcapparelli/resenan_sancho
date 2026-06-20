import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import genres from '../../../utils/constants/genres';
import { primaryButton, secondaryButton } from './styles';

interface BookManageRowProps {
  title: string;
  coverUrl?: string;
  genre: string; // genre code (e.g. "ADV")
  formats: string[];
  availableCopies: number;
  onPromote: () => void;
  onEdit: () => void;
}

const BookIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const BookManageRow: React.FC<BookManageRowProps> = ({
  title,
  coverUrl,
  genre,
  formats,
  availableCopies,
  onPromote,
  onEdit,
}) => {
  const { t } = useTranslation();
  const genreName = genres.find((g) => g.code === genre)?.name;
  const genreLabel = genreName ? t(`genres.${genreName}`) : genre;
  const promoting = availableCopies >= 1;

  const meta = [genreLabel, formats.join(', ')].filter(Boolean).join(' · ');

  return (
    <Row>
      <Main>
        {coverUrl
          ? <Cover src={coverUrl} alt={`Portada de ${title}`} />
          : <CoverFallback aria-hidden="true"><BookIcon /></CoverFallback>}
        <Center>
          <Title>{title}</Title>
          {meta && <Meta>{meta}</Meta>}
          <Status>
            <Dot $ok={promoting} aria-hidden="true">●</Dot>
            <StatusText>
              {promoting
                ? `${availableCopies} ejemplares disponibles`
                : 'No lo estás promocionando'}
            </StatusText>
          </Status>
        </Center>
      </Main>
      <Actions>
        {!promoting && <Hint>Actívalo</Hint>}
        <PromoteButton type="button" onClick={onPromote}>Promocionar</PromoteButton>
        <EditButton type="button" onClick={onEdit}>Editar</EditButton>
      </Actions>
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  gap: 16px;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
  min-width: 0;
`;

const Cover = styled.img`
  width: 56px;
  height: 75px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
`;

const CoverFallback = styled.div`
  width: 56px;
  height: 75px;
  border-radius: 6px;
  flex-shrink: 0;
  background: ${({ theme }) => theme.cream};
  color: ${({ theme }) => theme.lightBorder};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Center = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.ink};
  margin: 0 0 4px;
`;

const Meta = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
  margin: 0 0 8px;
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

const StatusText = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.brown};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const Hint = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.terracotta};
  text-align: center;

  @media (max-width: 600px) {
    width: 100%;
    text-align: left;
  }
`;

const PromoteButton = styled.button`
  ${primaryButton}
`;

const EditButton = styled.button`
  ${secondaryButton}
`;

export default BookManageRow;
