import React, { useState } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from '@material-ui/core';
import { UserRegister } from '../interfaces/user';
import { register } from '../config/routes';

const Register: React.FC = (): JSX.Element => {
  const initUserRegister: UserRegister = {
    name: '',
    lastName: '',
    email: '',
    password: '',
  };

  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserRegister>(initUserRegister);
  const [response, setResponse] = useState<string>('');

  const setRegisterValues = (
    name: string,
    value: string,
  ): void => setUserInfo({ ...userInfo, [name]: value });

  const signup = (): void => {
    fetch(register, {
      method: 'post',
      body: JSON.stringify({ ...userInfo }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(({ message }) => setResponse(message))
      .catch((error) => setResponse(error));
  };

  return (
    <StyledForm>
      <TextField
        id="outlined-basic"
        label={t('form.name')}
        name="name"
        variant="outlined"
        onChange={({ target: { name, value } }) => setRegisterValues(name, value)}
      />
      <TextField
        id="outlined-basic"
        label={t('form.lastname')}
        name="lastName"
        variant="outlined"
        onChange={({ target: { name, value } }) => setRegisterValues(name, value)}
      />
      <TextField
        id="outlined-basic"
        label={t('form.email')}
        name="email"
        variant="outlined"
        onChange={({ target: { name, value } }) => setRegisterValues(name, value)}
      />
      <TextField
        id="standard-password-input"
        label={t('form.password')}
        name="password"
        type="password"
        variant="outlined"
        onChange={({ target: { name, value } }) => setRegisterValues(name, value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={signup}
        size="large"
      >
        Registrar
      </Button>
      <p>{response}</p>
    </StyledForm>
  );
};

const StyledForm = styledComponents.form`
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 1rem;
      width: 50%;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;

export default Register;
