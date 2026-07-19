/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { PromotionServiceIcon } from './types';

// Inline SVG instead of emoji: emoji render differently on every platform and
// screen readers verbalise them. Same convention as BookManageRow / HelpSection.
interface IconProps {
  size?: number;
}

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

const GiftIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <svg {...svgProps} width={size} height={size}>
    <rect x="3" y="9" width="18" height="12" rx="1.5" />
    <path d="M3 13h18M12 9v12" />
    <path d="M12 9C10.5 9 7.5 8.6 7.5 6.2A2.2 2.2 0 0 1 12 5.6 2.2 2.2 0 0 1 16.5 6.2C16.5 8.6 13.5 9 12 9z" />
  </svg>
);

const BooksIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <svg {...svgProps} width={size} height={size}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M9 7h7" />
  </svg>
);

const StarIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <svg {...svgProps} width={size} height={size}>
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />
  </svg>
);

const RocketIcon: React.FC<IconProps> = ({ size = 22 }) => (
  <svg {...svgProps} width={size} height={size}>
    <path d="M12 2.5c3 2 4.8 5.4 4.8 9.2l-1.9 3.6H9.1L7.2 11.7C7.2 7.9 9 4.5 12 2.5z" />
    <circle cx="12" cy="10" r="1.7" />
    <path d="M9.1 15.3l-2.4 1.9.6 3.3 2.6-1.6M14.9 15.3l2.4 1.9-.6 3.3-2.6-1.6" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg {...svgProps} width={size} height={size}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <svg {...svgProps} width={size} height={size}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const ChevronIcon: React.FC<IconProps> = ({ size = 16 }) => (
  <svg {...svgProps} width={size} height={size}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 18 }) => (
  <svg {...svgProps} width={size} height={size}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const SERVICE_ICONS: Record<PromotionServiceIcon, React.FC<IconProps>> = {
  gift: GiftIcon,
  books: BooksIcon,
  star: StarIcon,
  rocket: RocketIcon,
};

export const ServiceIcon: React.FC<{ name: PromotionServiceIcon }> = ({ name }) => {
  const Icon = SERVICE_ICONS[name];
  return <Icon />;
};
