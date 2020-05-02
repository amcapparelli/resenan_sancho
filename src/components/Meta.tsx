/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Head from 'next/head';

interface MyProps {
  children: JSX.Element,
}

const Meta = ({ children }: MyProps): JSX.Element => (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="shortcut icon" href="/static/favicon.jpg" />
      <title>Reseñan Sancho</title>
      <link href="https://fonts.googleapis.com/css?family=Rambla&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css?family=Rock+Salt&display=swap" rel="stylesheet" />
    </Head>
    {children}
  </>
);

export default Meta;
