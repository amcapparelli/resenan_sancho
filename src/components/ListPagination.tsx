import React from 'react';
import Pagination from '@mui/material/Pagination';
import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import withStyles from '@mui/styles/withStyles';

interface MyProps {
  onChange: Function,
  totalPages: number
}

const useStyles = makeStyles((theme) => createStyles({
  root: {
    '& > *': {
      marginTop: theme.spacing(1),
    },
  },
}));

const StyledPagination = withStyles({
  ul: {
    justifyContent: 'center',
  },
})(Pagination);

const ListPagination = ({ onChange, totalPages }: MyProps) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <StyledPagination
        count={totalPages}
        shape="rounded"
        onChange={(e, page) => onChange && onChange(e, page)}
      />
    </div>
  );
};

export default ListPagination;
