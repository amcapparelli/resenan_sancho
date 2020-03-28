import { createMuiTheme } from '@material-ui/core';

const main = '#FFDE00';
const dark = '#EB8500';
const light = '#FAF5AE';
const contrastText = '#DE4A10';

export default createMuiTheme({
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
