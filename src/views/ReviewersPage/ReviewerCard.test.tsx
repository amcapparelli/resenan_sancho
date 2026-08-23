/**
 * Regression tests for ReviewerCard's description "Ver más" toggle.
 *
 * Bug: the toggle appeared whenever `description.length` exceeded a fixed char
 * threshold (240), decoupled from the real CSS `-webkit-line-clamp: 4`. A
 * description long enough to trip the threshold but short enough to still fit in
 * 4 rendered lines showed a "Ver más" that revealed nothing.
 *
 * Fix: the toggle now reflects REAL overflow of the collapsed element
 * (`scrollHeight > clientHeight`), measured via a ref/effect.
 *
 * jsdom performs no layout, so `scrollHeight`/`clientHeight` are 0 by default.
 * Each test stubs those getters on `HTMLElement.prototype` to feed the effect
 * deterministic measurements, and restores them afterwards.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { StyledTheme } from '../../store/context/StylesContext/Theme';
import ReviewerCard from './ReviewerCard';
import { Reviewer } from '../../interfaces/reviewer';
import { AvailableGenres } from '../../interfaces/genres';
import AvailableFormats from '../../interfaces/formats';

// react-i18next: return the last segment of the key as a plain string so genre
// badges render predictably — same precedent as BookCard.test.tsx.
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key.split('.').pop() ?? key,
  }),
}));

// ─── Fixture ─────────────────────────────────────────────────────────────────

// 265 chars: over the old 240 char threshold, so the length heuristic would
// (wrongly) show the toggle regardless of whether the text actually clamps.
const LONG_DESCRIPTION =
  'Reseñadora literaria especializada en narrativa contemporánea y ficción '
  + 'histórica, con más de diez años recomendando novelas independientes a una '
  + 'comunidad fiel de lectores que confían en su criterio honesto, cercano y '
  + 'siempre entusiasta por descubrir nuevas voces.';

const REVIEWER_FIXTURE: Reviewer = {
  author: {
    name: 'María',
    lastName: 'López',
    avatar: '',
    country: 'España',
  },
  blog: { name: '', url: '' },
  booktube: { name: '', url: '' },
  bookstagram: { name: '', url: '' },
  goodreads: { name: '', url: '' },
  amazon: { name: '', url: '' },
  genres: [AvailableGenres.adventure],
  formats: [AvailableFormats.papel],
  description: LONG_DESCRIPTION,
};

// ─── Measurement stubbing ────────────────────────────────────────────────────

/**
 * Stub the layout getters the overflow effect relies on. jsdom returns 0 for
 * both, so without this the effect can never observe overflow.
 */
function stubMeasurements(scrollHeight: number, clientHeight: number) {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  });
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => clientHeight,
  });
}

afterEach(() => {
  // Restore jsdom's default (0) so stubs don't leak across tests.
  delete (HTMLElement.prototype as unknown as { scrollHeight?: number }).scrollHeight;
  delete (HTMLElement.prototype as unknown as { clientHeight?: number }).clientHeight;
});

function renderCard(reviewer: Reviewer = REVIEWER_FIXTURE) {
  return render(
    <ThemeProvider theme={StyledTheme}>
      <ReviewerCard reviewer={reviewer} />
    </ThemeProvider>,
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ReviewerCard — description toggle', () => {
  it('does not show "Ver más" when the description fits within the clamp', () => {
    // Long text (over the old char threshold) but it does NOT overflow: the
    // collapsed element's content fits exactly in its box.
    stubMeasurements(100, 100);
    renderCard();

    expect(
      screen.queryByRole('button', { name: /ver más/i }),
    ).not.toBeInTheDocument();
  });

  it('shows "Ver más" when the collapsed description overflows, and toggles to "Ver menos"', async () => {
    // Content taller than its clamped box → genuine overflow → toggle needed.
    stubMeasurements(200, 100);
    const user = userEvent.setup();
    renderCard();

    const toggle = screen.getByRole('button', { name: /ver más/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);

    const collapseToggle = screen.getByRole('button', { name: /ver menos/i });
    expect(collapseToggle).toBeInTheDocument();
    expect(collapseToggle).toHaveAttribute('aria-expanded', 'true');
  });
});
