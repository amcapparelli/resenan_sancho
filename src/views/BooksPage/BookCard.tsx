import React from 'react';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Book } from '../../interfaces/books';
import genres from '../../utils/constants/genres';

interface BookCardProps {
  book: Book;
}

// Shared rule to disable motion for users who prefer it
const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    transform: none;
  }
`;

const Card = styled.article`
  overflow: hidden;
  height: 100%;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 4px rgba(61, 58, 53, 0.07);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(61, 58, 53, 0.14);
    transform: translateY(-2px);
  }

  ${reducedMotion}
`;

/* Takes the top 45% of the square card. flex-shrink: 0 prevents it
   from collapsing when CardBody content grows. */
const CoverArea = styled.div`
  position: relative;
  height: 60%;
`;

/* object-fit: contain shows the full image without cropping;
   cream background fills any empty space around it. */
const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
`;

// Shown when no cover URL is provided
const CoverFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cream};
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.3;
`;

const GenreBadge = styled.span`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(61, 58, 53, 0.75);
  backdrop-filter: blur(4px);
  color: ${({ theme }) => theme.cream};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 4px;
`;

const CardBody = styled.div`
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  overflow: hidden;
  min-height: 0;
`;

const Title = styled.h2`
  font-family: 'Fraunces', serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: ${({ theme }) => theme.ink};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Author = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Divider = styled.hr`
  border: none;
  border-top: 0.5px solid #e8dfc8;
  margin: 0;
`;

const Synopsis = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  line-height: 1.45;
  color: #5a524a;
  margin: 0;
  flex: 1;
  overflow: hidden;
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
  padding: 2px 8px;
  border-radius: 4px;
`;

const MetaRow = styled.div`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: #9a8c7e;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MetaDot = styled.span`
  color: ${({ theme }) => theme.lightBorder};
`;

// CTAButton is a next/link styled to look like a button. Styling Link directly
// yields a single <a> (with prefetching) instead of nesting <a> inside <a>.
const CTAButton = styled(Link)`
  background: ${({ theme }) => theme.amber};
  color: ${({ theme }) => theme.ink};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  padding: 8px 12px;
  border: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  margin-top: auto;
  min-height: 36px;
  text-decoration: none;
  box-sizing: border-box;
  transition: background 0.15s ease;

  &:hover {
    background: #d9a304;
  }

  &:active {
    transform: scale(0.98);
  }

  ${reducedMotion}
`;

const BookFallbackIcon: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { t } = useTranslation();
  const genreName =
    genres.find((g) => g.code === book.genre)?.name;
  const hasCover = Boolean(book.cover);

  return (
    <Card>
      <CoverArea>
        {hasCover ? (
          <CoverImage
            src={book.cover}
            alt={`Portada de ${book.title}`}
            loading="lazy"
          />
        ) : (
          <CoverFallback aria-hidden="true">
            <BookFallbackIcon />
          </CoverFallback>
        )}
        {genreName && <GenreBadge>{t(`genres.${genreName}`)}</GenreBadge>}
      </CoverArea>

      <CardBody>
        <Title>{book.title}</Title>
        <Author>
          por <strong>{book.author.name} {book.author.lastName}</strong>
        </Author>

        <Divider />

        <Synopsis>{book.synopsis}</Synopsis>

        <Divider />

        <FormatsRow>
          {book.formats.map((format) => (
            <FormatChip key={format}>{format}</FormatChip>
          ))}
        </FormatsRow>

        <MetaRow>
          <span>{book.pages} pág.</span>
          <MetaDot>·</MetaDot>
          <span>{book.editorial || 'Autor independiente'}</span>
        </MetaRow>

        <Divider />

        <CTAButton
          href={`/books/${book._id}`}
          aria-label={`Pedir ejemplar de ${book.title}`}
        >
          Pedir ejemplar gratuito →
        </CTAButton>
      </CardBody>
    </Card>
  );
};

export default BookCard;
