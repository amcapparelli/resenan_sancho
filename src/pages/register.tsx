import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import {
  Button,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ReactGA from 'react-ga';
import { register as registerURL } from '../config/routes';
import { useForm, useRequiredFieldsValidation, useFetch } from '../utils/customHooks';
import { PasswordFields } from '../components';
import { trackingId } from '../utils/constants/GATrackingID';

const fields = ['name', 'lastName', 'email'];
ReactGA.initialize(trackingId);

const Register: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const [signupResponse, signupRequest, loading] = useFetch();
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
    if (signupResponse.success) {
      router.push('/login');
    }
  }, [signupResponse.success]);

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

  const signup = (): void => {
    signupRequest(registerURL, 'post', registerForm);
    ReactGA.event({
      category: 'Sign Up',
      action: 'Usuario Registrado',
    });
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
      <Link href="/">
        <StyledLogo src="/static/logo.png" alt="logo reseñan sancho" />
      </Link>
      {fields.map((text) => (
        <TextField
          error={errors[text].length > 0}
          helperText={errors[text]}
          key={text}
          label={t(`form.${text}`)}
          name={text}
          type={text === 'email' ? 'email' : 'text'}
          variant="outlined"
          onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
        />
      ))}
      <PasswordFields
        onChange={(
          { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
        ) => setRegisterForm(name, value)}
        passwordErrors={passwordErrors}
        passwordIsValid={passwordIsValid}
        repeatPasswordIsValid={repeatPasswordIsValid}
        passwordLength={registerForm.password.length}
        repeatPasswordLength={registerForm.repeatPassword.length}
      />
      <StyledButton
        disabled={loading}
        variant="contained"
        color="primary"
        onClick={submit}
        size="large"
      >
        {loading ? t('buttons.saving') : t('buttons.register')}
      </StyledButton>
      {
        signupResponse.message
        && (
          <Alert variant="filled" severity={signupResponse.success ? 'success' : 'error'}>
            {signupResponse.message}
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
