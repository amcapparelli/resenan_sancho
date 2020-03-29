import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import styledComponents from 'styled-components';
import { Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { login } from '../config/routes';
import UserContext from '../store/context/userContext/UserContext';
import useForm from '../utils/customHooks/useForm';

const Login: React.FC = (): JSX.Element => {
  interface Response {
    success: boolean,
    message: string
  }
  const { t } = useTranslation();
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [loginForm, setLoginForm] = useForm({});
  const { setUserLogged } = useContext(UserContext);
  const router = useRouter();

  const loginRequest = async (): Promise<void> => {
    try {
      const res = await fetch(login, {
        method: 'post',
        body: JSON.stringify({ ...loginForm }),
        headers: { 'Content-Type': 'application/json' },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
        user,
        token,
      } = resJSON;
      setResponse({ message, success });
      setUserLogged({ ...user, token });
      if (success) router.push('/home');
    } catch (error) {
      setResponse(error);
    }
  };

  return (
    <StyledForm>
      {['email', 'password'].map((text) => (
        <TextField
          id="standard-password-input"
          label={t(`form.${text}`)}
          name={text}
          type={text}
          variant="outlined"
          onChange={({ target: { name, value } }) => setLoginForm(name, value)}
        />
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={loginRequest}
        size="large"
      >
        Login
      </Button>
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

export default Login;
