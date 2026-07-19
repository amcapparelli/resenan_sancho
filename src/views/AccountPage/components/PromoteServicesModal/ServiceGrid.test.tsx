/**
 * The desktop row used to hardcode four columns because the catalogue always
 * had four visible services. Now that `available: false` services are filtered
 * out upstream, the row has to size itself to what it actually receives, or a
 * three-service catalogue leaves a hole on the right.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../../store/context/StylesContext/Theme';
import ServiceGrid, { getGridColumnCount } from './ServiceGrid';
import promotionServices from './catalog';
import { PromotionService } from './types';

const eligibility = { freePromoAvailable: true, hasPaperFormat: true };

/** Builds `count` distinct services; only `key` and `name` need to differ. */
const buildServices = (count: number): PromotionService[] => (
  Array.from({ length: count }, (unused, index) => ({
    ...promotionServices[1],
    key: `service-${index}` as PromotionService['key'],
    name: `Servicio ${index}`,
  }))
);

const renderGrid = (count: number) => {
  render(
    <ThemeProvider theme={StyledTheme}>
      <ServiceGrid
        services={buildServices(count)}
        bookTitle="La sombra del viento"
        eligibility={eligibility}
        onSelect={jest.fn()}
      />
    </ThemeProvider>,
  );

  // The grid is the outermost list; the remaining ones are each card's bullets.
  return screen.getAllByRole('list')[0];
};

/**
 * Reads back the rules styled-components injected for this element inside a
 * given breakpoint. Asserting on the emitted CSS (rather than on a prop) is what
 * ties the test to the layout itself; scoping it to the element's own generated
 * class is what keeps rules from earlier renders in this file out of the way,
 * since the stylesheet is never reset between tests.
 */
const declarationsAt = (element: Element, minWidthPx: number): string => (
  Array.from(element.classList)
    .map((className) => {
      const block = new RegExp(`@media \\(min-width:${minWidthPx}px\\)\\{\\.${className}\\{([^}]*)\\}`);
      const match = Array.from(document.querySelectorAll('style'))
        .map((styleTag) => styleTag.textContent || '')
        .join('')
        .match(block);
      return match ? match[1] : '';
    })
    .join('')
);

describe('getGridColumnCount', () => {
  it('uses one column per service up to the four that fit on desktop', () => {
    expect(getGridColumnCount(1)).toBe(1);
    expect(getGridColumnCount(3)).toBe(3);
    expect(getGridColumnCount(4)).toBe(4);
  });

  it('caps longer catalogues so the row wraps instead of overflowing', () => {
    expect(getGridColumnCount(5)).toBe(4);
    expect(getGridColumnCount(12)).toBe(4);
  });

  it('never asks for zero columns, which is invalid CSS', () => {
    expect(getGridColumnCount(0)).toBe(1);
  });
});

describe('ServiceGrid', () => {
  it.each([1, 2, 3, 4])('lays out %i services in as many desktop columns', (count) => {
    const grid = renderGrid(count);

    expect(screen.getAllByRole('article')).toHaveLength(count);
    expect(declarationsAt(grid, 900)).toContain(`grid-template-columns:repeat(${count},1fr);`);
  });

  it('keeps the seven card bands whatever the column count', () => {
    // Each card spans 7 rows of the parent via subgrid, so the row template must
    // not be tied to how many columns the row ended up with.
    const grid = renderGrid(3);
    expect(declarationsAt(grid, 900)).toContain('grid-template-rows:auto auto auto auto 1fr auto auto;');
  });

  it('never stretches a lone card to half the row at the tablet breakpoint', () => {
    const grid = renderGrid(1);
    expect(declarationsAt(grid, 560)).toContain('grid-template-columns:repeat(1,1fr);');
  });
});
