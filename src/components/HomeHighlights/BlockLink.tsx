import Link from 'next/link';
import styled from 'styled-components';

/**
 * Text CTA that closes a home highlight block ("Ver todos los libros…",
 * "Explora los N géneros…"). It lives on its own so the two blocks share one
 * definition instead of a second copy of the same 20 lines.
 *
 * styled(Link) renders a single <a>: never wrap it in another Link.
 */
const BlockLink = styled(Link)`
  display: block;
  width: fit-content;
  margin: 24px auto 0;
  /* Only CTA of the block on mobile: the padding takes the tap target from the
     ~20px of the bare text line to the ~44px touch targets should have. */
  padding: 10px 12px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  /* Brown at rest, not the brand terracotta: at 15px terracotta only reaches
     4.24:1 on white and 3.77:1 on the cream section, both under the 4.5:1 AA
     asks for body text — and this is the only CTA of the block on mobile.
     theme.brown is at 8.03:1 / 7.14:1. Terracotta stays as the hover and focus
     colour, where the threshold is 3:1. */
  color: ${({ theme }) => theme.brown};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.terracotta};
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.terracotta};
    outline-offset: 3px;
  }
`;

export default BlockLink;
