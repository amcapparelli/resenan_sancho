import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  TextField,
  InputAdornment,
  Tooltip,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import Alert from '@material-ui/lab/Alert';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { register } from '../config/routes';
import useForm from '../utils/customHooks/useForm';
import { Response } from '../interfaces/response';

const initialErrors = {
  repeatPassword: '',
};

const Register: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [registerForm, setRegisterForm] = useForm({
    password: '',
  });
  const [errors, setErrors] = useState(initialErrors);

  useEffect(() => {
    const { password } = registerForm;
    const rules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (password.match(rules)) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  }, [registerForm.password]);

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

  const validatePasswords = () => {
    setErrors(initialErrors);
    const { password, repeatPassword } = registerForm;
    if (password === repeatPassword) signup();
    if (password !== repeatPassword) setErrors({ repeatPassword: 'las contraseñas no coinciden' });
  };

  return (
    <StyledForm>
      <StyledLogo src="/static/logo.png" alt="logo reseñan sancho" />
      {['name', 'lastName', 'email'].map((text) => (
        <TextField
          key={text}
          label={t(`form.${text}`)}
          name={text}
          type="text"
          variant="outlined"
          onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
        />
      ))}
      {['password', 'repeatPassword'].map((text) => (
        <TextField
          key={text}
          label={t(`form.${text}`)}
          name={text}
          type="password"
          variant="outlined"
          onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
          error={text === 'password' && registerForm.password.length >= 1 && !passwordIsValid}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {
                  text === 'password' && registerForm.password.length >= 1
                  && (passwordIsValid ? <StyledCheckIcon /> : <ErrorOutlineIcon />)
                }
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {
                  text === 'password'
                  && (
                    <Tooltip
                      title="La contraseña debe tener entre 7 y 20 caracteres y al menos una mayúscula, una minúscula y un número."
                    >
                      <HelpIcon />
                    </Tooltip>
                  )
                }
              </InputAdornment>
            ),
          }}
        />
      ))}
      <StyledButton
        variant="contained"
        color="primary"
        onClick={validatePasswords}
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
