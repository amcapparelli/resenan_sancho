import React from 'react';
import styledComponents from 'styled-components';
import Link from 'next/link';
import {
  Button,
  Typography,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const AddBook = () => {
  return (
    <StyledContainer>
      <Typography variant="h3" align="center">
        No tienes ningún libro todavía, agrega uno.
      </Typography>
      <Link href="/addBook">
        <Button><AddCircleIcon fontSize="large" /></Button>
      </Link>
    </StyledContainer>
  );
};

const StyledContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  justify-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export default AddBook;
