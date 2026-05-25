import { createMuiTheme } from '@material-ui/core';

const Palette = {
  mustard: '#F2B705',
  terracotta: '#C75B22',
  cream: '#FBF1D8',
  ink: '#3D3A35',
  warmBrown: '#6B4A16',
  errorRed: '#DE4A10',
};

export const StyledTheme = {
  // Aliases de compatibilidad usados por los styled-components existentes
  main: Palette.mustard,
  dark: Palette.terracotta,
  light: Palette.cream,
  contrastText: Palette.ink,
  // Nombres semánticos nuevos
  cream: Palette.cream,
  ink: Palette.ink,
  warmBrown: Palette.warmBrown,
  errorRed: Palette.errorRed,
  fontFamily: "'Source Sans 3', sans-serif",
  fontTitles: "'Fraunces', serif",
};

const headingStyle = { fontFamily: "'Fraunces', serif", fontWeight: 600 };

export const MuiTheme = createMuiTheme({
  typography: {
    fontFamily: "'Source Sans 3', sans-serif",
    h1: headingStyle,
    h2: headingStyle,
    h3: headingStyle,
    h4: headingStyle,
    h5: headingStyle,
    h6: headingStyle,
  },
  palette: {
    primary: {
      main: Palette.mustard,
      contrastText: Palette.ink,
    },
    secondary: {
      main: Palette.terracotta,
      contrastText: '#FFFFFF',
    },
    text: {
      primary: Palette.ink,
      secondary: Palette.warmBrown,
    },
    error: {
      main: Palette.errorRed,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none' as const,
      },
    },
  },
  spacing: 8,
});
