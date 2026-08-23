/* eslint-disable import/prefer-default-export */
// Named exports (like PromoteServicesModal/icons.tsx): this is an icon set that
// grows, and a default export would have to be renamed the moment it gains a
// second icon.
import React from 'react';

/**
 * Icons shared across features. Inline SVG instead of emoji or an icon font:
 * emoji render differently on every platform and screen readers verbalise them.
 *
 * They inherit `currentColor` and are always `aria-hidden`: every call site puts
 * a text label next to them, so announcing the icon would only duplicate it.
 */
interface IconProps {
  size?: number;
}

/** Success mark for confirmation banners and toasts. */
export const CheckIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Trash mark for destructive/reset actions, e.g. "Limpiar filtros". */
export const TrashIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
