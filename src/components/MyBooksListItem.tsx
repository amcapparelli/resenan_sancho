import React from 'react';
import styledComponents from 'styled-components';
import {
  Badge,
  CardActions,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import CheckIcon from '@material-ui/icons/Check';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import { Book } from '../interfaces/books';

interface Props {
  book: Book
  onClickPromote: Function
  onClickEdit: Function
}

const MyBooksListItem: React.FC<Props> = (
  { book, onClickPromote, onClickEdit }: Props,
): JSX.Element => {
  const {
    title,
    cover,
    copies,
  } = book;
  return (
    <Card>
      <CardContent>
        {
          copies < 1
            ? (
              <ListItem>
                <ListItemIcon><ErrorIcon color="error" fontSize="large" /></ListItemIcon>
                <ListItemText primary="No lo estás promocionando" />
              </ListItem>
            )
            : (
              <ListItem>
                <ListItemIcon><CheckIcon color="primary" fontSize="large" /></ListItemIcon>
                <ListItemText primary="¡Lo estás promocionando!" />
              </ListItem>
            )
        }
        <StyledContentContainer>
          <div>
            <Typography variant="h3" align="center">{title}</Typography>
          </div>
          <StyledOptionsContainer>
            <StyledImageContainer src={cover} alt={`${title} cover`} />
            <List>
              <ListItem button onClick={() => onClickPromote && onClickPromote()}>
                <ListItemIcon><StarsIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary="promocionar" />
              </ListItem>
              <ListItem button onClick={() => onClickEdit && onClickEdit()}>
                <ListItemIcon><EditIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary="editar" />
              </ListItem>
              <ListItem button onClick={() => onClickPromote && onClickPromote()}>
                <ListItemIcon>
                  <Badge color="secondary" badgeContent={copies}>
                    <LibraryBooksIcon color="secondary" />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="ejemplares" />
              </ListItem>
            </List>
          </StyledOptionsContainer>
        </StyledContentContainer>
        <CardActions>
          {
            copies < 1 &&
            <Typography variant="body1" align="left">
              {`Agrega ejemplares de 
            ${title} 
            con la opción PROMOCIONAR para que estén
            visibles en la sección «Libros disponibles».`}
            </Typography>
          }
        </CardActions>
      </CardContent>
    </Card>
  );
};

const StyledImageContainer = styledComponents.img`
  width: 100%;
  display:block;
  margin:auto;
  margin-bottom: 1%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
`;

const StyledContentContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 1fr 2fr;
`;

const StyledOptionsContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-self: center;
  justify-self: center;
`;

export default MyBooksListItem;
