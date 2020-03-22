/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import App, { AppProps } from 'next/app';
import UserContextProvider from '../store/context/userContext/UserContextProvider';
import { appWithTranslation } from '../i18n';

class MyApp extends App {
  render() {
    const { Component, pageProps }: AppProps = this.props;
    return (
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    );
  }
}

export default appWithTranslation(MyApp);
