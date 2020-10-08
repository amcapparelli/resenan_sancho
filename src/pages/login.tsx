import React, { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import styledComponents from 'styled-components';
import { Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { login as loginURL } from '../config/routes';
import UserContext from '../store/context/userContext/UserContext';
import { useForm, useFetch } from '../utils/customHooks';
import { StyledLink } from '../components';

const Login: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const [loginResponse, loginRequest, loading] = useFetch();
  const [loginForm, setLoginForm] = useForm({});
  const { setUserLogged } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (loginResponse.success) {
      setUserLogged({ ...loginResponse.user });
      router.query.previous
        ? router.push(router.query.previous.toString())
        : router.push('/');
    }
  }, [loginResponse.success]);

  const login = async (): Promise<void> => {
    loginRequest(loginURL, 'post', loginForm);
  };

  return (
    <StyledForm>
      <Link href="/">
        <StyledLogo src="/static/logo-web.webp" alt="logo reseñan sancho" />
      </Link>
      {['email', 'password'].map((text) => (
        <TextField
          label={t(`form.${text}`)}
          name={text}
          type={text}
          variant="outlined"
          onChange={({ target: { name, value } }) => setLoginForm(name, value)}
        />
      ))}
      <StyledButton
        disabled={loading}
        variant="contained"
        color="primary"
        onClick={login}
        size="large"
      >
        {loading ? t('buttons.loading') : 'Login'}
      </StyledButton>
      <StyledLink
        anchor={t('link.forgotPassword')}
        href="/forgot"
      />
      <StyledLink
        anchor={t('link.register')}
        href="/register"
      />
      {
        loginResponse.message
        && (
          <Alert variant="filled" severity={loginResponse.success ? 'success' : 'error'}>
            {loginResponse.message}
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

const StyledForm = styledComponents.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  width: 30%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledButton = styledComponents(Button)`
  width: 40%;
  justify-self: center;
`;
export default Login;
