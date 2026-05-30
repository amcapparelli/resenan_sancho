import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    main: string;
    dark: string;
    light: string;
    contrastText: string;
    fontFamily: string;
    fontTitles: string;
  }
}
