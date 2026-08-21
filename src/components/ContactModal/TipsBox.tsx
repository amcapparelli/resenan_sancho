import React from 'react';
import styled from 'styled-components';
import { BookmarkIcon } from './icons';

/**
 * Friendly reminder shown above the message field. Its content is fixed by the
 * spec (no props): it exists to cut down requests with no real intention to
 * review, so the wording is deliberate and not caller-configurable.
 *
 * Two short rules in a real list, headingless: this box used to be the tallest
 * block in the sheet and pushed the consent checkbox below the fold on a phone,
 * and a list also lets a screen reader announce how many rules there are.
 * Anything about what to write in the message belongs in MessageField's help
 * text, not here — it used to be duplicated in both.
 */
const TipsBox: React.FC = () => (
  <Box>
    <IconSlot>
      <BookmarkIcon />
    </IconSlot>
    <Tips>
      <li>Pídelo solo si te apetece leerlo y reseñarlo.</li>
      <li>Si al final no puedes, avísale: mejor que el silencio.</li>
    </Tips>
  </Box>
);

const Box = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
  padding: 16px 16px 16px 14px;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;

  /* Only the bottom sheet is short on height; the desktop dialog keeps the
     original spacing. */
  @media (max-width: 899px) {
    margin-bottom: 16px;
    padding-top: 14px;
    padding-bottom: 14px;
  }
`;

const IconSlot = styled.div`
  flex-shrink: 0;
  display: flex;
  color: ${({ theme }) => theme.terracotta};
`;

const Tips = styled.ul`
  margin: 0;
  /* The browser default (~40px) is too greedy here: the box already sits inside
     the sheet padding and next to the icon, leaving ~250px of text width on a
     360px phone, so an over-indented marker costs an extra wrapped line. */
  padding-left: 17px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.brown};

  li + li {
    margin-top: 6px;
  }
`;

export default TipsBox;
