import React from 'react';
import styledComponents from 'styled-components';
import {
  Button,
} from '@material-ui/core';

interface MyProps {
  text: string,
  onChange: Function
}

const UploadImagesInput: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { text, onChange } = props;
  return (
    <Button>
      <StyledInputFile
        accept="image/*"
        id="raised-button-file"
        multiple
        type="file"
        onChange={(e) => onChange && onChange(e)}
      />
      <StyledLabel htmlFor="raised-button-file">
        {text}
      </StyledLabel>
    </Button>
  );
};

const StyledInputFile = styledComponents.input`
  display: none;
`;

const StyledLabel = styledComponents.label`
  color: ${(props) => props.theme.contrastText};
  border-radius: 20px;
  padding: 7%;
  width: 90%;
  align-self: flex-start;
  text-align: center;
  justify-self: center;
  background-color: ${(props) => props.theme.main};
  :hover{
    cursor: pointer;
  }
`;

export default UploadImagesInput;
