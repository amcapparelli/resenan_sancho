import styled from 'styled-components';

/**
 * Accented word(s) inside a heading, shared by PageHeader, the home highlight
 * headings and the hero strips. font-style: normal keeps the semantic <em>
 * from italicizing the accent.
 */
const HeadingAccent = styled.em`
  font-style: normal;
  color: ${({ theme }) => theme.terracotta};
`;

export default HeadingAccent;
