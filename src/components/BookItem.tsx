import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { Paper, Typography } from '@material-ui/core';
import { useFetchBook } from '../utils/customHooks';

interface Props {
  id: string | string[] | undefined,
}

const BookItem = (props: Props) => {
  const [state, fetchBook] = useFetchBook();
  const { id } = props;
  const {
    title,
    author,
    cover,
    synopsis,
  } = state;
  useEffect(() => {
    fetchBook(id);
  }, []);

  return (
    <Paper>
      <StyledCardContentContainer>
        <div>
          <Typography variant="h2">{title}</Typography>
          <Typography variant="subtitle1">{`${author.name} ${author.lastName}`}</Typography>
          <Typography variant="body1">{synopsis}</Typography>
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
