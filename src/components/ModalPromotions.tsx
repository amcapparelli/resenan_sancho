import React, { useState } from 'react';
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
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ModalDialog } from '.';

interface MyProps {
  bookSelected: string,
  show: boolean
  onClose: Function
}

const ModalPromotions = (props: MyProps) => {
  const { bookSelected, show, onClose } = props;
  const [showMore, setShowMore] = useState({
    open: false,
    row: '',
  });
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
        {`¡Promociona este Libro: ${bookSelected}!`}
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
    <ModalDialog
      open={show}
      onClose={() => onClose && onClose()}
      content={ModalPromotionsContent}
    />
  );
};


export default ModalPromotions;
