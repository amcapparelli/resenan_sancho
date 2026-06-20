import { createTheme } from '@mui/material/styles';

enum Palette {
  main = '#FFDE00',
  dark = '#EB8500',
  light = '#FAF5AE',
  contrastText = '#DE4A10',
  amber = '#F2B705',
  terracotta = '#C75B22',
  cream = '#FBF1D8',
  ink = '#3D3A35',
  brown = '#6B4A16',
  white = '#FFFFFF',
  lightBorder = '#d4c9b0',
  appBackground = '#FAF6EC',
  success = '#4a9b5f',
  danger = '#DE4A10',
  muted = '#9a8c7e',
  terracottaSoft = '#fdf3ee',
}

const {
  main,
  dark,
  light,
  contrastText,
  amber,
  terracotta,
  cream,
  ink,
  brown,
  white,
  lightBorder,
  appBackground,
  success,
  danger,
  muted,
  terracottaSoft,
} = Palette;

export const StyledTheme = {
  main,
  dark,
  light,
  contrastText,
  fontFamily: 'Rambla',
  fontTitles: 'Rambla',
  amber,
  terracotta,
  cream,
  ink,
  brown,
  white,
  lightBorder,
  appBackground,
  success,
  danger,
  muted,
  terracottaSoft,
};

export const MuiTheme = createTheme({
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
