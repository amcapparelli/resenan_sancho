/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import styledComponents from 'styled-components';
import {
  Button,
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
    editorial,
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
              title={
                (
                  <Typography variant="h5" align="left">
                    {title}
                  </Typography>
                )
              }
              subheader={
                `${author.name} ${author.lastName || ''} (${editorial || 'autor independiente'})`
              }
            />
          </StyledCardHeader>
          <StyledCardMain>
            <Typography component="span" align="left">
              {synopsis.substring(0, 200)}
              ...
            </Typography>
            <Link href={{ pathname: '/books', query: { book: _id } }}>
              <Typography component="span" color="secondary" align="left">{t('link.readMore')}</Typography>
            </Link>
          </StyledCardMain>
          <StyledCardCover>
            <StyledImageContainer src={cover} alt={`${title} cover`} />
            <Typography variant="body1" align="center">{`${t('books.pages')}: ${pages}`}</Typography>
            <StyledGenreChip
              size="small"
              label={t(`genres.${genres.find((g) => g.code === genre).name}`)}
              color="primary"
            />
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
            <StyledButtonContainer>
              <Link href={{ pathname: '/books', query: { book: _id } }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Ver más / Pedir ejemplar
                </StyledButton>
              </Link>
            </StyledButtonContainer>
          </StyledCardFooter>
        </StyledCardContentContainer>
      </CardContent>
    </Card>
  );
};


const StyledButton = styledComponents(Button)`
  color: ${(props) => props.theme.main};
  :hover{
    background-color: ${(props) => props.theme.light};
    color: ${(props) => props.theme.main};
  }
`;

const StyledButtonContainer = styledComponents.div`
  @media (max-width: 768px) {
    margin-left: 15%;
  }
  @media (max-width: 375px) {
    margin-left: 0;
  }
  margin-top: 5%;
  margin-left: 30%;
`;

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
  margin-top: 1%;
  width: 90%;
  justify-self: center;
`;

const StyledFormatChip = styledComponents(Chip)`
  width: 90%;
`;

export default BookListItem;
