import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Paper,
  Typography,
  Chip,
} from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { useFetchBook } from '../utils/customHooks';
import genres from '../utils/constants/genres';

interface MyProps {
  id: string | string[] | undefined,
}

const BookItem: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const [state, fetchBook] = useFetchBook();
  const { t } = useTranslation();
  const { id } = props;
  const {
    title,
    author,
    cover,
    synopsis,
    genre,
    pages,
    copies,
  } = state;
  useEffect(() => {
    fetchBook(id);
  }, []);

  const handleOrderCopy = () => {
    console.log('ordercopy');
  };

  return (
    <Paper>
      <StyledCardContentContainer>
        <StyledHeadContainer>
          <Typography variant="h2">{title}</Typography>
          <Typography variant="subtitle1">{`${author.name} ${author.lastName}`}</Typography>
        </StyledHeadContainer>
        <StyledMainContainer>
          <Typography variant="body1">{synopsis}</Typography>
          <Typography variant="body1" align="left">{`${t('books.pages')}: ${pages}`}</Typography>
          <StyledGenreChip
            size="small"
            label={genre && t(`genres.${genres.find((g) => g.code === genre).name}`)}
            color="primary"
          />
        </StyledMainContainer>
        <StyledFootContainer>
          <Button
            variant="contained"
            startIcon={<LibraryBooksIcon />}
            color="secondary"
            onClick={handleOrderCopy}
          >
            {`Pedir un ejemplar. Hay ${copies} disponibles`}
          </Button>
        </StyledFootContainer>
        <StyledImageContainer src={cover} />
      </StyledCardContentContainer>
    </Paper>
  );
};

const StyledGenreChip = styledComponents(Chip)`
  width: 30%;
`;

const StyledHeadContainer = styledComponents.div`
  grid-area: head;
`;

const StyledMainContainer = styledComponents.div`
  grid-area: main;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  padding-right: 10%;
`;

const StyledFootContainer = styledComponents.div`
  grid-area: foot;
  align-self: end;
  justify-self: center;
`;

const StyledImageContainer = styledComponents.img`
  grid-area: cover;
  width: 60%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
`;

const StyledCardContentContainer = styledComponents.div`
  margin-top: 3%;
  display: grid;
  grid-template-areas: "head cover"
                       "main cover"
                       "foot cover";
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 2fr .5fr;
  padding: 2%;
`;

export default BookItem;
