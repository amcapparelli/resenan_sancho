import React from 'react';
import styledComponents from 'styled-components';
import {
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const EmptyList = () => (
  <StyledContainer>
    <Typography variant="h3" align="center">
      No hay resultados. Intenta con otros filtros.
    </Typography>
    <SearchIcon fontSize="large" />
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
export default EmptyList;
