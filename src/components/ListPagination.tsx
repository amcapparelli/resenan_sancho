import React from 'react';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

interface MyProps {
  onChange: Function,
  totalPages: number
}

const StyledPagination = styled(Pagination)({
  '& .MuiPagination-ul': {
    justifyContent: 'center',
  },
});

const ListPagination = ({ onChange, totalPages }: MyProps) => (
  <Box sx={{ '& > *': { mt: 1 } }}>
    <StyledPagination
      count={totalPages}
      shape="rounded"
      onChange={(e, page) => onChange && onChange(e, page)}
    />
  </Box>
);

export default ListPagination;
