import React from 'react';
import styledComponents from 'styled-components';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import StarsIcon from '@material-ui/icons/Stars';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Book } from '../interfaces/books';

interface Props {
  book: Book
}

const MyBooksListItem: React.FC<Props> = ({ book }: Props): JSX.Element => {
  const {
    title,
    cover,
  } = book;
  return (
    <Card>
      <CardContent>
        <StyledContentContainer>
          <div>
            <Typography variant="h3" align="center">{title}</Typography>
            <StyledImageContainer src={cover} alt={`${title} cover`} />
          </div>
          <StyledOptionsContainer>
            <List>
              <ListItem button>
                <ListItemIcon><StarsIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary="promocionar" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><EditIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary="editar" />
              </ListItem>
              <ListItem button>
                <ListItemIcon><DeleteIcon color="secondary" fontSize="large" /></ListItemIcon>
                <ListItemText primary="eliminar" />
              </ListItem>
            </List>
          </StyledOptionsContainer>
        </StyledContentContainer>
      </CardContent>
    </Card>
  );
};

const StyledImageContainer = styledComponents.img`
  width: 90%;
  display:block;
  margin:auto;
  margin-bottom: 1%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
`;

const StyledContentContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

const StyledOptionsContainer = styledComponents.div`
  align-self: center;
  justify-self: center;
`;

export default MyBooksListItem;
