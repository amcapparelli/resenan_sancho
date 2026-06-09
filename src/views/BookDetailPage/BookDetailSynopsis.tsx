import React from 'react';
import styled from 'styled-components';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetailSynopsisProps {
  synopsis: string;
}

// ─── Styled ──────────────────────────────────────────────────────────────────

const Section = styled.section`
  background: ${({ theme }) => theme.white};
  padding: 28px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 600px) {
    padding: 40px 28px;
  }
`;

const Inner = styled.div`
  max-width: 860px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Eyebrow = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.brown};
  white-space: nowrap;
`;

// Decorative horizontal rule — purely visual, no semantic role
const Rule = styled.span`
  flex: 1;
  display: block;
  height: 0.5px;
  background: ${({ theme }) => theme.lightBorder};
`;

const Body = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 16px;
  line-height: 1.75;
  color: ${({ theme }) => theme.ink};
  max-width: 660px;
  margin: 0;
`;

// ─── Component ───────────────────────────────────────────────────────────────

const BookDetailSynopsis: React.FC<BookDetailSynopsisProps> = ({ synopsis }) => (
  <Section>
    <Inner>
      <Header aria-hidden="true">
        <Eyebrow>SINOPSIS</Eyebrow>
        <Rule />
      </Header>

      <Body>{synopsis}</Body>
    </Inner>
  </Section>
);

export default BookDetailSynopsis;
