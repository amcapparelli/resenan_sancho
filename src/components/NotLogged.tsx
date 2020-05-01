import React from 'react';
import styledComponents from 'styled-components';
import Link from 'next/link';
import {
  Button,
  Typography,
} from '@material-ui/core';
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen';

const NotLogged = () => (
  <StyledContainer>
    <Typography variant="h3" align="center">
      No te has logueado.
    </Typography>
    <Link href="/login">
      <Button><AddToHomeScreenIcon fontSize="large" /></Button>
    </Link>
  </StyledContainer>
);

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
export default NotLogged;
