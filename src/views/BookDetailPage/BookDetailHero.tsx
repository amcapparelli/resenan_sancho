import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Book } from '../../interfaces/books';
import genres from '../../utils/constants/genres';
import BookDetailCTA from './BookDetailCTA';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetailHeroProps {
  book: Book;
  isLoggedIn: boolean;
  onRequest: () => void;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const PageIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const BookIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="14"
    height="14"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const BookFallbackIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    width="64"
    height="64"
    aria-hidden="true"
  >
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

// ─── Styled ──────────────────────────────────────────────────────────────────

const Section = styled.section`
  background: ${({ theme }) => theme.cream};
  padding: 28px 20px 32px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 600px) {
    padding: 40px 28px 44px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  max-width: 860px;
  margin: 0 auto;

  @media (min-width: 600px) {
    grid-template-columns: 200px 1fr;
    gap: 28px;
  }

  @media (min-width: 900px) {
    grid-template-columns: 240px 1fr;
    gap: 36px;
  }
`;

// ─── Cover column ────────────────────────────────────────────────────────────

const CoverCol = styled.div`
  position: relative;
`;

const CoverImage = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center top;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(61, 58, 53, 0.18);
  display: block;
  max-width: 200px;
  margin: 0 auto;

  @media (min-width: 600px) {
    max-width: 100%;
  }
`;

const CoverFallback = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(61, 58, 53, 0.18);
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.3;
  max-width: 200px;
  margin: 0 auto;

  @media (min-width: 600px) {
    max-width: 100%;
  }
`;

// ─── Info column ─────────────────────────────────────────────────────────────

const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
`;

const GenreBadge = styled.span`
  background: rgba(61, 58, 53, 0.08);
  border: 1px solid ${({ theme }) => theme.lightBorder};
  color: ${({ theme }) => theme.brown};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 4px;
`;

const FormatsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const FormatChip = styled.span`
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  color: ${({ theme }) => theme.brown};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 10px;
  border-radius: 4px;
`;

const Title = styled.h1`
  font-family: 'Fraunces', serif;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  color: ${({ theme }) => theme.ink};
  margin: 0;

  @media (min-width: 600px) {
    font-size: 28px;
  }
`;

const AuthorLine = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.brown};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AuthorName = styled.strong`
  font-weight: 600;
`;

const Divider = styled.hr`
  border: none;
  border-top: 0.5px solid ${({ theme }) => theme.lightBorder};
  margin: 0;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: #9a8c7e;
`;

// ─── Component ───────────────────────────────────────────────────────────────

const BookDetailHero: React.FC<BookDetailHeroProps> = ({
  book,
  isLoggedIn,
  onRequest,
}) => {
  const { t } = useTranslation();

  const genreName = genres.find((g) => g.code === book.genre)?.name;
  const hasCover = Boolean(book.cover);

  return (
    <Section>
      <Grid>
        {/* Left column — cover */}
        <CoverCol>
          {hasCover ? (
            <CoverImage
              src={book.cover}
              alt={`Portada de ${book.title}`}
            />
          ) : (
            <CoverFallback aria-label="Sin portada">
              <BookFallbackIcon />
            </CoverFallback>
          )}
        </CoverCol>

        {/* Right column — info */}
        <InfoCol>
          {/* Genre badge + format chips */}
          <TopRow>
            {genreName && (
              <GenreBadge>{t(`genres.${genreName}`)}</GenreBadge>
            )}
            {book.formats.length > 0 && (
              <FormatsRow>
                {book.formats.map((format) => (
                  <FormatChip key={format}>{format}</FormatChip>
                ))}
              </FormatsRow>
            )}
          </TopRow>

          {/* Title */}
          <Title>{book.title}</Title>

          {/* Author */}
          <AuthorLine>
            por{' '}
            <AuthorName>
              {book.author.name} {book.author.lastName}
            </AuthorName>
          </AuthorLine>

          <Divider />

          {/* Metadata */}
          <MetaRow>
            {book.pages && (
              <MetaItem>
                <PageIcon />
                {book.pages} páginas
              </MetaItem>
            )}
            <MetaItem>
              <BookIcon />
              {book.editorial || 'Editorial independiente'}
            </MetaItem>
          </MetaRow>

          <Divider />

          {/* CTA */}
          <BookDetailCTA
            isLoggedIn={isLoggedIn}
            copies={book.copies}
            onRequest={onRequest}
          />
        </InfoCol>
      </Grid>
    </Section>
  );
};

export default BookDetailHero;
