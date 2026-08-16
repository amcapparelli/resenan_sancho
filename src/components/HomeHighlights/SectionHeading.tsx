import React from 'react';
import styled from 'styled-components';

interface SectionHeadingProps {
  /** Small uppercase label above the title. Rendered only when provided. */
  eyebrow?: string;
  /**
   * Title content. It is a node (not a string) because the accent word can sit
   * anywhere in the sentence — see `HeadingAccent`.
   */
  children: React.ReactNode;
  subtitle?: string;
}

/**
 * Heading chrome shared by the home highlight blocks. It mirrors the eyebrow +
 * accented title + subtitle pattern of `PageHeader`, but renders an <h2>:
 * these blocks hang from the hero's <h1>, and PageHeader is the page-level
 * banner (<header> + <h1>), so reusing it here would emit a second <h1>.
 */
const SectionHeading = ({ eyebrow, children, subtitle }: SectionHeadingProps): JSX.Element => (
  <Wrapper>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <Title>{children}</Title>
    {subtitle && <Subtitle>{subtitle}</Subtitle>}
  </Wrapper>
);

const Wrapper = styled.div`
  text-align: center;
  margin: 0 auto 24px;
  max-width: 560px;
`;

const Eyebrow = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.brown};
  margin: 0 0 8px;
`;

const Title = styled.h2`
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1.15;
  color: ${({ theme }) => theme.ink};
  margin: 0;

  @media (min-width: 480px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: ${({ theme }) => theme.brown};
  margin: 10px 0 0;
`;

/** font-style: normal keeps the semantic <em> from italicizing the accent. */
export const HeadingAccent = styled.em`
  font-style: normal;
  color: ${({ theme }) => theme.terracotta};
`;

export default SectionHeading;
