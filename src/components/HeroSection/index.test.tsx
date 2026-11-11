import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import HeroSection from '.';

const renderHero = () => render(
  <ThemeProvider theme={StyledTheme}>
    <HeroSection />
  </ThemeProvider>,
);

describe('HeroSection', () => {
  it('renders a single h1 with the writer headline', () => {
    // Strings are duplicated on purpose (not imported) so a typo in the source
    // fails here; "Que" has no accent mark (it is not a question).
    renderHero();

    const pageTitles = screen.getAllByRole('heading', { level: 1 });
    expect(pageTitles).toHaveLength(1);
    expect(pageTitles[0]).toHaveTextContent('Que hablen de tu libro.');
  });

  it('renders the reviewer strip headline as an h2', () => {
    renderHero();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Que descubran tus reseñas literarias.' }),
    ).toBeInTheDocument();
  });

  it('labels each strip with its own headline', () => {
    renderHero();

    expect(screen.getByRole('region', { name: 'Que hablen de tu libro.' })).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Que descubran tus reseñas literarias.' }),
    ).toBeInTheDocument();
  });

  it('puts the writer strip before the reviewer strip in the DOM', () => {
    // The layout never reorders the strips visually, so DOM order is both the
    // reading order and the on-screen order: stacked on mobile, left → right
    // on desktop.
    renderHero();

    const writerStrip = screen.getByRole('region', { name: 'Que hablen de tu libro.' });
    const reviewerStrip = screen.getByRole('region', {
      name: 'Que descubran tus reseñas literarias.',
    });
    expect(
      writerStrip.compareDocumentPosition(reviewerStrip) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('renders the card titles below the strip headlines (h3)', () => {
    renderHero();

    expect(
      screen.getByRole('heading', { level: 3, name: 'Quiero reseñas para mi libro' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Quiero descubrir libros nuevos' }),
    ).toBeInTheDocument();
  });

  it('links each card to its destination inside its own strip', () => {
    renderHero();

    const writerStrip = screen.getByRole('region', { name: 'Que hablen de tu libro.' });
    expect(
      within(writerStrip).getByRole('link', { name: 'Buscar reseñadores →' }),
    ).toHaveAttribute('href', '/reviewers');

    const reviewerStrip = screen.getByRole('region', {
      name: 'Que descubran tus reseñas literarias.',
    });
    expect(
      within(reviewerStrip).getByRole('link', { name: 'Ver libros disponibles →' }),
    ).toHaveAttribute('href', '/books');
  });
});
