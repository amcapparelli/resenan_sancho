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
        {/*
          Per-page <title> and <meta name="description"> live in the <Seo>
          component (mounted per page), not here. This file only holds truly
          global head tags.
        */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#1E78B6" />
        {/* Lightweight ~12KB favicon (replaces the old ~90KB favicon.jpg). */}
        <link rel="icon" href="/static/favicon.png" />
        <link rel="apple-touch-icon" href="/static/favicon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/*
          Google Fonts stylesheets live in `_document` instead of here: Next 15
          warns against adding `rel="stylesheet"` via next/head. See _document.tsx.
        */}
      </Head>
      {children}
    </>
  );
};

export default Meta;
