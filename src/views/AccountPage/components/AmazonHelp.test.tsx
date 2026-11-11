/**
 * What must not regress in the Amazon help panel: it starts collapsed and
 * out of the tab order (aria-hidden), and the trigger button toggles both
 * its own `aria-expanded` and the panel's `aria-hidden` in lockstep.
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
