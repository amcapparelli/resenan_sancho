import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';

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
