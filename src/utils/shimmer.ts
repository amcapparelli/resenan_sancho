import { css, keyframes } from 'styled-components';

const shimmerAnimation = keyframes`
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
`;

// Skeleton shimmer gradient shared by the loading placeholders. Reduced-motion
// users get a static fallback.
export const shimmer = css`
  background: linear-gradient(90deg, #ede3cb 25%, #f5edda 50%, #ede3cb 75%);
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    background: #ede3cb;
  }
`;
