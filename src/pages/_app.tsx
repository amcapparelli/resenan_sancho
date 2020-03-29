/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import App, { AppProps } from 'next/app';
import { MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from 'styled-components';
import UserContextProvider from '../store/context/userContext/UserContextProvider';
import { MuiTheme, StyledTheme } from '../store/context/StylesContext/Theme';
import { appWithTranslation } from '../i18n';
import { Meta } from '../components';

class MyApp extends App {
  render() {
    const { Component, pageProps }: AppProps = this.props;
    return (
      <ThemeProvider theme={StyledTheme}>
        <MuiThemeProvider theme={MuiTheme}>
          <UserContextProvider>
            <Meta>
              <Component {...pageProps} />
            </Meta>
          </UserContextProvider>
        </MuiThemeProvider>
      </ThemeProvider>
    );
  }
}

export default appWithTranslation(MyApp);
