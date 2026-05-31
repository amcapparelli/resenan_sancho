/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as ScThemeProvider } from 'styled-components';
import UserContextProvider from '../store/context/userContext/UserContextProvider';
import { MuiTheme, StyledTheme } from '../store/context/StylesContext/Theme';
import createEmotionCache from '../utils/createEmotionCache';
import { Meta } from '../components';
import '../i18n';

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps,
}: MyAppProps) => (
  <CacheProvider value={emotionCache}>
    <MuiThemeProvider theme={MuiTheme}>
      <CssBaseline />
      <ScThemeProvider theme={StyledTheme}>
        <UserContextProvider>
          <Meta>
            <Component {...pageProps} />
          </Meta>
        </UserContextProvider>
      </ScThemeProvider>
    </MuiThemeProvider>
  </CacheProvider>
);

export default MyApp;
