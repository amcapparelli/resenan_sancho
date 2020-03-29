import { createMuiTheme } from '@material-ui/core';


const main = '#FFDE00';
const dark = '#EB8500';
const light = '#FAF5AE';
const contrastText = '#DE4A10';

export const StyledTheme = {
  main,
};

export const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main,
      dark,
      light,
      contrastText,
    },
  },
  spacing: 8,
});
