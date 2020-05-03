/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import {
  Button,
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Alert from '@material-ui/lab/Alert';
import UserContext from '../store/context/userContext/UserContext';
import { useFetch } from '../utils/customHooks';
import { Book } from '../interfaces/books';
import { promotions as URL } from '../config/routes';
import { ModalDialog } from '.';
import promotions from '../utils/constants/promotions';

interface MyProps {
  bookSelected: Book,
  show: boolean
  onClose: Function
}

interface Row {
  id: number,
  more: string,
  name: string,
  price: number | string,
  moreInfo: string
}

const ModalPromotions: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { user } = useContext(UserContext);
  const { bookSelected, show, onClose } = props;
  const [showMore, setShowMore] = useState({
    open: false,
    row: '',
  });
  const [response, asyncRequest] = useFetch();
  const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });
  const classes = useStyles();
  function createData(
    id: number,
    more: string,
    name: string,
    price: string,
    moreInfo: string,
  ): Row {
    return {
      id,
      more,
      name,
      price,
      moreInfo,
    };
  }
  const rows: Array<Row> = [
    ...promotions.map((p) => createData(
      p.id,
      'Más info',
      `Ofrecer ${p.copies} ejemplares de este libro para reseña`,
      p.price > 0 ? `${p.price.toString()}€` : '¡GRATIS!',
      p.moreInfo,
    )), createData(3, 'Más info', '¡Quiero acelerar! Recomendar mi novela vía email a reseñadores', '60€', 'bla'),
  ];

  const StyledTableCell = withStyles((theme: Theme) => createStyles({
    body: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      padding: '2%',
    },
  }))(TableCell);

  const handleClick = (book: Book, id: number) => {
    asyncRequest(`${URL}/${book._id}`, 'put', {
      copies: promotions.find((p) => p.id === id).copies,
      author: user._id,
    });
  };

  const ModalPromotionsContent: JSX.Element = (
    <>
      <Typography variant="h3" align="center">
        {bookSelected && `¡Promociona este Libro: ${bookSelected.title}!`}
      </Typography>
      <Typography variant="subtitle1" align="center">Estas son las opciones que tienes:</Typography>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Más información</TableCell>
              <TableCell>Servicio</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="right">Elegir</TableCell>
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
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClick(bookSelected, row.id)}
                      size="small"
                    >
                      ¡Lo Quiero!
                    </Button>
                  </TableCell>
                </TableRow>
                {showMore.open && showMore.row === row.name && (
                  <TableRow>
                    <StyledTableCell colSpan={4}>
                      {row.moreInfo}
                    </StyledTableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        response.message
        && (
          <Alert variant="filled" severity={response.success ? 'success' : 'error'}>
            {response.message}
          </Alert>
        )
      }
    </>
  );

  return (
    <ModalDialog
      open={show}
      onClose={() => onClose && onClose()}
      content={ModalPromotionsContent}
    />
  );
};


export default ModalPromotions;
