/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
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
import { ModalDialog, PaymentCheckout } from '.';
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
  price: any,
  moreInfo: string
}

const PUBLISHABLE_KEY: string = process.env.NODE_ENV === 'production' ? 'pk_live_hnHykpu6AzNWJfUxxFdbB12a00pLwBhUR9' : 'pk_test_CcNp900cqt0Ps35Yp1iT1XYY00cu0xb9VY';
const stripePromise = loadStripe(PUBLISHABLE_KEY);

const ModalPromotions: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { user } = useContext(UserContext);
  const [openPayment, setOpenPayment] = useState(false);
  const [amount, setAmount] = useState(0);
  const [promo, setPromo] = useState(null);
  const { bookSelected, show, onClose } = props;
  const [showMore, setShowMore] = useState({
    open: false,
    row: '',
  });
  const [response, asyncRequest] = useFetch();
  const [tableMinWidth, setTableMinWidth] = useState(650);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (mediaQuery.matches) {
      setTableMinWidth(500);
    }
  }, []);
  const useStyles = makeStyles({
    table: {
      minWidth: tableMinWidth,
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
      p.info,
      p.price > 0 ? `${p.price}0€` : '¡GRATIS!',
      p.moreInfo,
    )),
  ];

  const StyledTableCell = withStyles((theme: Theme) => createStyles({
    body: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      padding: '2%',
    },
  }))(TableCell);

  const handleClickFreePromo = (book: Book, id: number) => {
    setPromo(id);
    asyncRequest(`${URL}/${book._id}`, 'put', {
      copies: promotions.find((p) => p.id === id).copies,
      author: user._id,
      chosenPromo: id,
    });
  };

  const handleClickPaidPromo = (book: Book, id: number) => {
    setOpenPayment(true);
    setPromo(id);
    setAmount(promotions.find((p) => p.id === id).price);
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
                    {
                      row.id === 1
                        ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleClickFreePromo(bookSelected, row.id)}
                            size="small"
                          >
                            ¡Lo Quiero!
                          </Button>
                        )
                        : (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleClickPaidPromo(bookSelected, row.id)}
                          >
                            ¡Lo Quiero!
                          </Button>
                        )
                    }
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
        <Elements stripe={stripePromise}>
          <PaymentCheckout
            open={openPayment}
            onClose={() => setOpenPayment(false)}
            amount={amount}
            image={bookSelected && bookSelected.cover}
            bookTitle={bookSelected && bookSelected.title}
            description={
              `Añadir 
              ${promotions.find((p) => p.price === amount).copies} 
              ejemplares para reseña de 
              ${bookSelected && bookSelected.title}`
            }
            chosenPromo={promo}
            bookId={bookSelected && bookSelected._id}
          />
        </Elements>
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
