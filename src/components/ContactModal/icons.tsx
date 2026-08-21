/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

// Inline SVG instead of emoji: emoji render differently on every platform and
// screen readers verbalise them. Same convention as PromoteServicesModal/icons.
interface IconProps {
  size?: number;
}

const strokeProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const CloseIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...strokeProps} width={size} height={size}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/**
 * Brand bookmark motif (the rounded ribbon that crosses the logo wordmark).
 * Filled rather than stroked, and sized 18×22 as the spec asks, so it reads as
 * a solid marker next to the tips text.
 */
export const BookmarkIcon: React.FC = () => (
  <svg
    viewBox="0 0 18 22"
    width="18"
    height="22"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9 0a6 6 0 0 0-6 6v16l6-3.6L15 22V6a6 6 0 0 0-6-6z" />
  </svg>
);
