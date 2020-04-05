import React, { useEffect, useReducer } from 'react';
import styledComponents from 'styled-components';
import { Paper, Typography } from '@material-ui/core';
import { book as URL } from '../config/routes';
import { bookLoad } from '../store/reducers';
import { Book } from '../interfaces/books';

interface Props {
  id: string | string[] | undefined,
}

const initialState: Book = {
  _id: undefined,
  title: undefined,
  author: {
    name: undefined,
    lastName: undefined,
  },
  cover: undefined,
};

const BookItem = (props: Props) => {
  const [state, dispatch] = useReducer(bookLoad, initialState);
  const { id } = props;
  const { title, author, cover } = state;
  useEffect(() => {
    async function fetchBook() {
      try {
        const response = await fetch(`${URL}/${id}`, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        });
        const book = await response.json();
        dispatch({
          type: 'BOOK_LOAD',
          payload: book,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchBook();
  }, []);

  return (
    <Paper>
      <StyledCardContentContainer>
        <div>
          <Typography variant="h2">{title}</Typography>
          <Typography variant="subtitle1">{`${author.name} ${author.lastName}`}</Typography>
        </div>
        <StyledImageContainer src={cover} />
      </StyledCardContentContainer>
    </Paper>
  );
};

const StyledImageContainer = styledComponents.img`
  width: 60%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
`;

const StyledCardContentContainer = styledComponents.div`
  margin-top: 3%;
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 2%;
`;

export default BookItem;
