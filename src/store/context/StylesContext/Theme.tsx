import { createMuiTheme } from '@material-ui/core';

enum Palette {
  main = '#FFDE00',
  dark = '#EB8500',
  light = '#FAF5AE',
  contrastText = '#DE4A10'
}

const {
  main,
  dark,
  light,
  contrastText,
} = Palette;

export const StyledTheme = {
  main,
  dark,
  light,
  contrastText,
  fontFamily: 'Rambla',
  fontTitles: 'Rambla',
};

export const MuiTheme = createMuiTheme({
  typography: {
    fontFamily: 'Rambla',
  },
  palette: {
    primary: {
      main,
      dark,
      light,
      contrastText,
    },
    secondary: {
      main: dark,
    },
  },
  spacing: 8,
});
