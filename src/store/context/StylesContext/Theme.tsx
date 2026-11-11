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
  // Darker green for text/borders: `success` only reaches 3.42:1 on white,
  // which is below the 4.5:1 AA needs for body text.
  successDark = '#3a7a4b',
  danger = '#DE4A10',
  muted = '#9a8c7e',
  terracottaSoft = '#fdf3ee',
  // Warm sand that sits next to `cream` as a distinct block (home hero, reviewer
  // strip). Holds the ink card without merging into it: ink 8.6:1, brown 6.1:1;
  // terracotta reaches 3.2:1, so only use it here for large headline text.
  sand = '#F3DFB0',
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
  successDark,
  danger,
  muted,
  terracottaSoft,
  sand,
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
  successDark,
  danger,
  muted,
  terracottaSoft,
  sand,
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
