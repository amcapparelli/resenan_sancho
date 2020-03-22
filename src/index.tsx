import React from 'react';
import reactDOM from 'react-dom';
import './styles/style.scss';
import { ErrorBoundary } from './components';
import MyApp from './pages/_app';

const ROOT = document.querySelector('.container');

reactDOM.render(
  <ErrorBoundary>
    <MyApp />
  </ErrorBoundary>,
  ROOT,
);
