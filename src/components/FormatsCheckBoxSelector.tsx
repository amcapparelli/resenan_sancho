import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@material-ui/core';

interface MyProps {
  errors: string,
  options: Array<string>
  title: string,
  onChange: Function,
}

const CheckBoxOptions: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const {
    errors,
    title,
    onChange,
    options,
  } = props;
  return (
    <div>
      <FormLabel component="legend">{title}</FormLabel>
      <FormGroup>
        {options.map((format) => (
          <FormControlLabel
            key={format}
            control={(
              <Checkbox
                onChange={(e) => onChange && onChange(e)}
                name={format}
                color="primary"
              />
            )}
            label={format}
          />
        ))}
        <FormHelperText error>{errors}</FormHelperText>
      </FormGroup>
    </div>
  );
};

export default CheckBoxOptions;
