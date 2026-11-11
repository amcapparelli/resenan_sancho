/**
 * What must not regress in the Amazon help panel: it starts collapsed and
 * out of the tab order (aria-hidden), and the trigger button toggles both
 * its own `aria-expanded` and the panel's `aria-hidden` in lockstep. It must
 * also collapse to truly zero height: no box chrome (padding, border, margin)
 * on the grid wrapper or its single child, or a slice of text stays visible.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../../store/context/StylesContext/Theme';
import AmazonHelp from './AmazonHelp';

const renderAmazonHelp = () => render(
  <ThemeProvider theme={StyledTheme}>
    <AmazonHelp />
  </ThemeProvider>,
);

const getTrigger = (): HTMLElement => screen.getByRole('button', { name: /dónde encuentro este enlace/i });

const getPanel = (): HTMLElement => document.getElementById('amazon-help') as HTMLElement;

describe('AmazonHelp', () => {
  it('starts collapsed, out of the tab order', () => {
    renderAmazonHelp();

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(getPanel()).toHaveAttribute('aria-hidden', 'true');
  });

  it('opens the panel on click', async () => {
    renderAmazonHelp();

    await userEvent.click(getTrigger());

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
    expect(getPanel()).toHaveAttribute('aria-hidden', 'false');
  });

  it('closes the panel on a second click', async () => {
    renderAmazonHelp();

    await userEvent.click(getTrigger());
    await userEvent.click(getTrigger());

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(getPanel()).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('AmazonHelp collapse styles', () => {
  // jsdom doesn't do layout, so we can't measure height; instead we assert the
  // CSS contract that makes a 0fr grid track actually reach zero.
  // The panel's single grid item (PanelClip); its own single child is PanelContent.
  const getClip = (): HTMLElement => getPanel().firstElementChild as HTMLElement;
  const getContent = (): HTMLElement => getClip().firstElementChild as HTMLElement;

  // Checked per side on purpose: jsdom leaves the `margin`/`padding`/`border`
  // shorthands as '' when only one side is set, so they'd hide a regression.
  const verticalBoxProperties = [
    'marginTop',
    'marginBottom',
    'paddingTop',
    'paddingBottom',
    'borderTopWidth',
    'borderBottomWidth',
  ] as const;
  const EMPTY_OR_ZERO = /^(0(px)?)?$/;

  it('collapses the grid track to 0fr while closed and 1fr when open', async () => {
    renderAmazonHelp();

    expect(getComputedStyle(getPanel()).getPropertyValue('grid-template-rows')).toBe('0fr');

    await userEvent.click(getTrigger());

    expect(getComputedStyle(getPanel()).getPropertyValue('grid-template-rows')).toBe('1fr');
  });

  it('keeps padding, border and margin off the elements that must shrink to zero', () => {
    renderAmazonHelp();

    [getPanel(), getClip()].forEach((element) => {
      const style = getComputedStyle(element);
      verticalBoxProperties.forEach((property) => {
        expect(style[property]).toMatch(EMPTY_OR_ZERO);
      });
    });
  });

  it('keeps the gap under the trigger inside the clip, on the content box', () => {
    renderAmazonHelp();

    expect(getComputedStyle(getContent()).marginTop).toBe('8px');
  });

  it('lets the grid item shrink below its content and clips the overflow', () => {
    renderAmazonHelp();

    const clipStyle = getComputedStyle(getClip());
    expect(clipStyle.getPropertyValue('min-height')).toBe('0');
    expect(clipStyle.overflow).toBe('hidden');
  });
});
