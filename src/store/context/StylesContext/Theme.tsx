import { createMuiTheme } from '@material-ui/core';

enum Palette {
  main = '#FFDE00',
  dark = '#EB8500',
  light = '#FAF5AE',
  contrastText = '#DE4A10'
}

export const StyledTheme = {
  main: Palette.main,
};

export const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      main: Palette.main,
      dark: Palette.dark,
      light: Palette.light,
      contrastText: Palette.contrastText,
    },
  },
  spacing: 8,
});
