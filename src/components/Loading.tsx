/* eslint-disable react/react-in-jsx-scope */
import styledComponents, { keyframes } from 'styled-components';

const Loading = () => (
  <StyledUl>
    <StyledLi />
    <StyledLi />
    <StyledLi />
    <StyledLi />
    <StyledLi />
    <StyledLi />
  </StyledUl>
);


const animate = keyframes`
  0% { transform: scaleY(1); }
  25% { transform: scaleY(1); }
  50% { transform: scaleY(1); }
  75% { transform: scaleY(1); }
  100% { transform: scaleY(3); }
`;

const StyledUl = styledComponents.ul`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
`;

const StyledLi = styledComponents.li`
  list-style: none;
  width: 6px;
  height: 30px;
  background: ${(props) => props.theme.main};
  margin: 0 4px;
  animation: ${animate} 0.7s infinite alternate;
  &:nth-child(1) {
    animation-delay: .1s;
  }
  &:nth-child(2) {
    animation-delay: .2s;
  }
  &:nth-child(3) {
    animation-delay: .3s;
  }
  &:nth-child(4) {
    animation-delay: .4s;
  }
  &:nth-child(5) {
    animation-delay: .5s;
  }
  &:nth-child(6) {
    animation-delay: .6s;
  }
`;

export default Loading;
