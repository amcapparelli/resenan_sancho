/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styledComponents from 'styled-components';
import {
  CardHeader,
  Chip,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Book } from '../interfaces/books';
import genres from '../utils/constants/genres';

interface Props {
  book: Book
}

const BookListItem: React.FC<Props> = ({ book }: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    genre,
    synopsis,
    formats,
    pages,
    title,
    author,
    cover,
    _id,
  } = book;
  return (
    <Card>
      <CardContent>
        <StyledCardContentContainer>
          <StyledCardHeader>
            <CardHeader
              title={<Typography variant="h5" align="left">{title}</Typography>}
              subheader={`${author.name} ${author.lastName}`}
            />
          </StyledCardHeader>
          <StyledCardMain>
            <Typography component="span" align="left">
              {synopsis.substring(0, 150)}
              ...
            </Typography>
            <Link href={{ pathname: '/books', query: { book: _id } }}>
              <Typography component="span" color="secondary" align="left">{t('link.readMore')}</Typography>
            </Link>
          </StyledCardMain>
          <StyledCardCover>
            <StyledImageContainer src={cover} alt={`${title} cover`} />
            <Typography variant="body1" align="center">{`${t('books.pages')}: ${pages}`}</Typography>
          </StyledCardCover>
          <StyledCardFooter>
            <StyledChipsFormatsContainer>
              <Typography variant="body1" align="left">
                {t('books.availableFormats')}
                :
              </Typography>
              {
                formats.map((format) => (
                  <StyledFormatChip
                    size="small"
                    label={format}
                    color="secondary"
                  />
                ))
              }
            </StyledChipsFormatsContainer>
            <StyledGenreChip
              size="small"
              label={t(`genres.${genres.find((g) => g.code === genre).name}`)}
              color="primary"
            />
          </StyledCardFooter>
        </StyledCardContentContainer>
      </CardContent>
    </Card>
  );
};

const StyledCardContentContainer = styledComponents.div`
  display: grid;
  grid-template-areas: "head cover"
                       "main cover"
                       "foot foot";
  grid-template-rows: 1fr 2fr 1fr;
  grid-template-columns: 2fr 1fr;           
`;

const StyledCardHeader = styledComponents.div`
  grid-area: head;
`;

const StyledCardMain = styledComponents.div`
  padding: 5%;
  grid-area: main;
`;

const StyledCardCover = styledComponents.div`
  grid-area: cover;
`;

const StyledCardFooter = styledComponents.div`
  grid-area: foot;
`;

const StyledChipsFormatsContainer = styledComponents.div`
  margin-top: 1rem;
  display: grid;
  grid-gap: .1rem;
  grid-template-columns: repeat(6, auto);
`;

const StyledImageContainer = styledComponents.img`
  width: 90%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
  padding-top: 5%;
  margin-bottom: 10%;
`;

const StyledGenreChip = styledComponents(Chip)`
  width: 40%;
  justify-self: center;
  margin-top: 1rem;
`;

const StyledFormatChip = styledComponents(Chip)`
  width: 90%;
`;

export default BookListItem;
