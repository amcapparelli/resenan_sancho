import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import { login } from '../config/routes';
import UserContext from '../store/context/userContext/UserContext';

const Login: React.FC = (): JSX.Element => {
  interface LoginInfo {
    email: string,
    password: string
  }
  const initLoginInfo: LoginInfo = {
    email: '',
    password: '',
  };

  const { t } = useTranslation();
  const [response, setResponse] = useState<string>('');
  const [loginInfo, setLoginInfo] = useState<LoginInfo>(initLoginInfo);
  const { setUserLogged } = useContext(UserContext);
  const history = useHistory();

  const setLoginValues = (name: string, value: string): void => {
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const loginRequest = async (): Promise<void> => {
    try {
      const res = await fetch(login, {
        method: 'post',
        body: JSON.stringify({ ...loginInfo }),
        headers: { 'Content-Type': 'application/json' },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
        user,
        token,
      } = resJSON;
      setResponse(message);
      setUserLogged({ ...user, token });
      if (success) history.push('/home');
    } catch (error) {
      setResponse(error);
    }
  };

  return (
    <>
      <TextField
        id="outlined-basic"
        label={t('form.email')}
        name="email"
        variant="outlined"
        onChange={({ target: { name, value } }) => setLoginValues(name, value)}
      />
      <TextField
        id="standard-password-input"
        label={t('form.password')}
        name="password"
        type="password"
        variant="outlined"
        onChange={({ target: { name, value } }) => setLoginValues(name, value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={loginRequest}
        size="large"
      >
        Login
      </Button>
      <p>{response}</p>
    </>
  );
};

export default Login;
