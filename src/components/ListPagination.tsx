import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import styledComponents from 'styled-components';

interface MyProps {
  onChange: Function,
  totalPages: number
}

const ListPagination = ({ onChange, totalPages }: MyProps) => (
  <StyledPagination
    count={totalPages}
    shape="rounded"
    onChange={(e, page) => onChange && onChange(e, page)}
  />
);

const StyledPagination = styledComponents(Pagination)`
  @media (max-width: 375px) {
    margin-left: 0;
  }
  margin-left: 35%;
`;

export default ListPagination;
