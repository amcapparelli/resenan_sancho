import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import AboutPlatform from './AboutPlatform';

const renderBlock = () => render(
  <ThemeProvider theme={StyledTheme}>
    <AboutPlatform />
  </ThemeProvider>,
);

describe('AboutPlatform', () => {
  it('renders the section heading as an h2', () => {
    // The home's h1 belongs to the hero: this block hangs from it.
    renderBlock();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Qué es Reseñan Sancho' }),
    ).toBeInTheDocument();
  });

  it('renders the approved copy of both paragraphs, word for word', () => {
    // This text is the home's main indexable content, so it is locked verbatim
    // (see docs/home-quees-section-spec.md). The strings below are DUPLICATED on
    // purpose instead of imported from the component: a shared constant would
    // move with any typo introduced in the source and assert nothing. RTL's
    // default normalizer collapses the whitespace of the multi-line JSX, so the
    // full sentence matches as written here.
    renderBlock();

    expect(screen.getByText(
      'Reseñan Sancho conecta a personas que escriben con personas que reseñan. '
      + 'Cada libro encuentra a quien puede leerlo con criterio, y cada reseñador '
      + 'encuentra libros que encajan con lo que le gusta leer.',
    )).toBeInTheDocument();

    expect(screen.getByText(
      'Además, ofrecemos servicios pensados para dar más visibilidad a tu libro: '
      + 'desde el envío de ejemplares gratuitos hasta campañas de promoción que '
      + 'ayudan a que más reseñadores lo descubran.',
    )).toBeInTheDocument();
  });
});
