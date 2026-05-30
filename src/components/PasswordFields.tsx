import React from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  FormHelperText,
  TextField,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface MyProps {
  passwordIsValid: boolean,
  onChange: Function,
  repeatPasswordIsValid: boolean,
  passwordErrors: string,
  passwordLength: number,
  repeatPasswordLength: number
}

const PasswordFields: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const {
    passwordErrors,
    passwordLength,
    repeatPasswordLength,
    onChange,
    passwordIsValid,
    repeatPasswordIsValid,
  } = props;
  const { t } = useTranslation();

  return (
    <>
      <TextField
        label={t('form.password')}
        name="password"
        type="password"
        variant="outlined"
        onChange={(e) => onChange && onChange(e)}
        error={passwordLength >= 1 && !passwordIsValid}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {
                passwordLength >= 1
                && (passwordIsValid ? <StyledCheckIcon /> : <ErrorOutlineIcon />)
              }
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                title="La contraseña debe tener entre 7 y 20 caracteres y al menos una mayúscula, una minúscula y un número."
              >
                <HelpIcon />
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        label={t('form.repeatPassword')}
        name="repeatPassword"
        type="password"
        variant="outlined"
        onChange={(e) => onChange && onChange(e)}
        error={repeatPasswordLength >= 1 && !repeatPasswordIsValid}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {
                repeatPasswordLength >= 1
                && (repeatPasswordIsValid ? <StyledCheckIcon /> : <ErrorOutlineIcon />)
              }
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText error>{passwordErrors}</FormHelperText>
    </>
  );
};


const StyledCheckIcon = styledComponents(CheckCircleOutlineIcon)`
  color: green;
`;

export default PasswordFields;
