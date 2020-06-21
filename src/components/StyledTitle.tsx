import React from 'react';
import styledComponents from 'styled-components';

interface MyProps {
  text: string
}

const StyledTitle = ({ text }: MyProps) => (
  <StyledText>{text}</StyledText>
);


const StyledText = styledComponents.h1`
  @media (max-width: 375px) {
    font-size: 2rem;
    line-height: 60px;
  }
  margin: 0;
  padding: 0 5% 0 5%;
  font-family: ${(props) => props.theme.fontTitles};
  color: #252525;
  font-size: 4rem;
  line-height: 120px;
  text-align: center;
  font-weight: 100;
`;
export default StyledTitle;
