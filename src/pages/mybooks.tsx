/* eslint-disable no-underscore-dangle */
import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import styledComponents from 'styled-components';
import {
  ListItem,
  Paper,
  Typography,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Table,
  TableBody,
} from '@material-ui/core';
import {
  makeStyles,
  withStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import { Book } from '../interfaces/books';
import { booksListLoad } from '../store/reducers';
import { mybooks as URL } from '../config/routes';
import { MyBooksListItem, ModalDialog } from '../components';
import { Response } from '../interfaces/response';

interface State {
  books: Array<Book>;
}
const initialState: State = {
  books: [],
};

const MyBooks: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [state, dispatch] = useReducer(booksListLoad, initialState);
  const [showModalPromotions, setShowModalPromotions] = useState(false);
  const [bookSelected, setBookSelected] = useState<string>('');
  const [showMore, setShowMore] = useState({
    open: false,
    row: '',
  });
  useEffect(() => {
    async function fetchMyBooks() {
      try {
        const res = await fetch(`${URL}/${user._id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Token': user.token,
          },
        });
        const books = await res.json();
        dispatch({
          type: 'USER_BOOKS_LIST_LOAD',
          payload: books,
        });
      } catch (error) {
        setResponse(error);
      }
    }
    fetchMyBooks();
  }, []);

  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();
  function createData(more: string, name: string, price: string) {
    return {
      more,
      name,
      price,
    };
  }

  const rows = [
    createData('Más info', 'Mostrar el libro como disponible para reseña durante 1 mes', '¡GRATIS!'),
    createData('Más info', 'Mostrar el libro como destacado durante 1 mes', '60€'),
  ];

  const StyledTableCell = withStyles((theme: Theme) => createStyles({
    body: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      padding: '2%',
    },
  }))(TableCell);

  const ModalPromotionsContent = (
    <>
      <Typography variant="h3" align="center">
        ¡Promociona este Libro:
        {bookSelected}
        !
      </Typography>
      <Typography variant="subtitle1" align="center">Estas son las opciones que tienes:</Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Más información</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell align="right">Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <>
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row" align="center">
                    <ListItem
                      button
                      onClick={() => setShowMore({
                        open: !showMore.open,
                        row: row.name,
                      })}
                    >
                      {showMore.open && showMore.row === row.name ? 'cerrar' : row.more}
                      <KeyboardArrowDownIcon color="secondary" fontSize="small" />
                    </ListItem>
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                </TableRow>
                {showMore.open && showMore.row === row.name && (
                  <TableRow>
                    <StyledTableCell colSpan={3}>Más información</StyledTableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <MyProfileLayout
      title={t('titles.mybooks')}
    >
      <div>
        <StyledList>
          {
            state.books && state.books.map(
              // eslint-disable-next-line no-underscore-dangle
              (book) => (
                <li key={book._id}>
                  <MyBooksListItem
                    onClickPromote={() => {
                      setShowModalPromotions(true);
                      setBookSelected(book.title);
                    }}
                    book={book}
                  />
                </li>
              ),
            )
          }
        </StyledList>
        <ModalDialog
          open={showModalPromotions}
          onClose={() => setShowModalPromotions(false)}
          content={ModalPromotionsContent}
        />
        {
          response.message
          && (
            <Alert variant="filled" severity={response.success ? 'success' : 'error'}>
              {response.message}
            </Alert>
          )
        }
      </div>
    </MyProfileLayout>
  );
};

const StyledList = styledComponents.ul`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
`;

export default MyBooks;
