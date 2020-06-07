import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Paper,
  Typography,
  Chip,
} from '@material-ui/core';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { ModalContact } from '.';
import { useFetchBook } from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import genres from '../utils/constants/genres';

interface MyProps {
  id: string | string[] | undefined,
}

const BookItem: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { isLogged } = useContext(UserContext);
  const [state, fetchBook] = useFetchBook();
  const [openModalContact, setOpenModalContact] = useState(false);
  const [copiesDecrease, setCopiesDecrease] = useState<number>(0);
  const { t } = useTranslation();
  const { id } = props;
  const {
    _id,
    editorial,
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
  }, [copiesDecrease]);

  const handleOrderCopy = () => {
    setOpenModalContact(true);
  };

  return (
    <>
      <Paper>
        <StyledCardContentContainer>
          <StyledHeadContainer>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="subtitle1">
              {`${author.name} ${author.lastName || ''} (${editorial || 'autor independiente'})`}
            </Typography>
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
            {
              isLogged
                ? (
                  <Button
                    disabled={copies === 0}
                    variant="contained"
                    startIcon={<LibraryBooksIcon />}
                    color="secondary"
                    size="large"
                    onClick={handleOrderCopy}
                  >
                    {`Pedir un ejemplar. Hay ${copies} disponibles`}
                  </Button>
                )
                : (
                  <Link href="/login">
                    <Button
                      color="secondary"
                    >
                      Para Pedir un ejemplar tienes que estar logueado.
                    </Button>
                  </Link>
                )
            }

          </StyledFootContainer>
          <StyledImageContainer src={cover} />
        </StyledCardContentContainer>
      </Paper>
      <ModalContact
        open={openModalContact}
        onClose={(copiesOrdered: number) => {
          setCopiesDecrease(copiesOrdered);
          setOpenModalContact(false);
        }}
        book={_id}
        bookTitle={title}
      />
    </>
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
