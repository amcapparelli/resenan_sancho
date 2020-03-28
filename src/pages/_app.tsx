/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import App, { AppProps } from 'next/app';
import { MuiThemeProvider } from '@material-ui/core';
import UserContextProvider from '../store/context/userContext/UserContextProvider';
import Theme from '../store/context/StylesContext/Theme';
import { appWithTranslation } from '../i18n';

class MyApp extends App {
  render() {
    const { Component, pageProps }: AppProps = this.props;
    return (
      <MuiThemeProvider theme={Theme}>
        <UserContextProvider>
          <Component {...pageProps} />
        </UserContextProvider>
      </MuiThemeProvider>
    );
  }
}

export default appWithTranslation(MyApp);
