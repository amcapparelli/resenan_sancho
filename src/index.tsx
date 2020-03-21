import React, { Suspense } from 'react';
import reactDOM from 'react-dom';
import { CircularProgress } from '@material-ui/core';
import './styles/style.scss';
import styledComponents from 'styled-components';
import { ErrorBoundary } from './components';
import App from './App';
import './i18n';

const ROOT = document.querySelector('.container');

const Spinner = styledComponents.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  `;

reactDOM.render(
  <ErrorBoundary>
    <Suspense
      fallback={(
        <Spinner>
          <CircularProgress />
        </Spinner>
      )}
    >
      <App />
    </Suspense>
  </ErrorBoundary>,
  ROOT,
);
