/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect } from 'react';
import Head from 'next/head';
import ReactGA from "react-ga4";
import { trackingId } from '../utils/constants/GATrackingID';

interface MyProps {
  children: JSX.Element,
}

const Meta = ({ children }: MyProps): JSX.Element => {
  useEffect(() => {
    ReactGA.initialize(trackingId);
  }, []);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content="Platform where reviewers can find free books to review on their literary blogs, booktube or bookstagram. Authors can contact literary reviewers to promote their books." />
        <link rel="shortcut icon" href="/static/favicon.jpg" />
        <title>Reseñan Sancho</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {children}
    </>
  );
};

export default Meta;
