import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormHelperText,
  TextField,
  InputAdornment,
  Tooltip,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { register } from '../config/routes';
import { useForm, useRequiredFieldsValidation } from '../utils/customHooks';
import { Response } from '../interfaces/response';

const fields = ['name', 'lastName', 'email'];

const Register: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });

  const [registerForm, setRegisterForm] = useForm({
    name: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
  });

  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [repeatPasswordIsValid, setRepeatPasswordIsValid] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string>('');
  const initialErrors = {
    name: '',
    lastName: '',
    email: '',
  };
  const [errors, validateRequiredFields] = useRequiredFieldsValidation(initialErrors);

  useEffect(() => {
    const { password } = registerForm;
    const rules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (password.match(rules)) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  }, [registerForm.password]);

  useEffect(() => {
    const { password, repeatPassword } = registerForm;
    if (password === repeatPassword) setRepeatPasswordIsValid(true);
    if (password !== repeatPassword) setRepeatPasswordIsValid(false);
  }, [registerForm.repeatPassword]);

  const signup = async (): Promise<void> => {
    try {
      const res = await fetch(register, {
        method: 'post',
        body: JSON.stringify({ ...registerForm }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
      } = resJSON;
      setResponse({ message, success });
    } catch (error) {
      setResponse(error);
    }
  };

  const submit = () => {
    if (!passwordIsValid || !repeatPasswordIsValid) {
      return setPasswordErrors('la contraeña no es válida');
    }
    setPasswordErrors('');
    const requiredFields = fields;
    return validateRequiredFields(registerForm, requiredFields, signup);
  };

  return (
    <StyledForm>
      <StyledLogo src="/static/logo.png" alt="logo reseñan sancho" />
      {fields.map((text) => (
        <TextField
          error={errors[text].length > 0}
          helperText={errors[text]}
          key={text}
          label={t(`form.${text}`)}
          name={text}
          type="text"
          variant="outlined"
          onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
        />
      ))}
      <TextField
        label={t('form.password')}
        name="password"
        type="password"
        variant="outlined"
        onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
        error={registerForm.password.length >= 1 && !passwordIsValid}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {
                registerForm.password.length >= 1
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
        onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
        error={registerForm.repeatPassword.length >= 1 && !repeatPasswordIsValid}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {
                registerForm.repeatPassword.length >= 1
                && (repeatPasswordIsValid ? <StyledCheckIcon /> : <ErrorOutlineIcon />)
              }
            </InputAdornment>
          ),
        }}
      />
      <FormHelperText error>{passwordErrors}</FormHelperText>
      <StyledButton
        variant="contained"
        color="primary"
        onClick={submit}
        size="large"
      >
        {t('buttons.register')}
      </StyledButton>
      {
        response.message
        && (
          <Alert variant="filled" severity={response.success ? 'success' : 'error'}>
            {response.message}
          </Alert>
        )
      }
    </StyledForm>
  );
};

const StyledLogo = styledComponents.img`
  width: 25%;
  justify-self: center;
`;

const StyledCheckIcon = styledComponents(CheckCircleOutlineIcon)`
  color: green;
`;

const StyledForm = styledComponents.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  width: 35%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledButton = styledComponents(Button)`
  width: 40%;
  justify-self: center;
`;
export default Register;
