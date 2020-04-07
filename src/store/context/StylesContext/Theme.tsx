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
  },
  spacing: 8,
});
