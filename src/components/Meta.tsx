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
        <link href="https://fonts.googleapis.com/css?family=Rambla&display=swap" rel="stylesheet" />
        {/* Fuentes del rediseño: Fraunces (titulares) + Source Sans 3 (cuerpo) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,400&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet" />
      </Head>
      {children}
    </>
  );
};

export default Meta;
