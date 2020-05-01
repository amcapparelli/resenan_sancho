/* eslint-disable react/react-in-jsx-scope */
import Link from 'next/link';
import styledComponents from 'styled-components';

interface MyProps {
  anchor: string,
  href: any
}

const StyledLink = ({ anchor, href }: MyProps) => (
  <Link href={href}>
    <StyledA>{anchor}</StyledA>
  </Link>
);

const StyledA = styledComponents.a`
  text-decoration: none;
  align-self: center;
  justify-self: center;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1.2rem;
  color: ${(props) => props.theme.dark};
  :hover{
    cursor: pointer;
    color: ${(props) => props.theme.main};
  }
`;

export default StyledLink;
