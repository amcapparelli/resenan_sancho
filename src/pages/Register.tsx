import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  TextField,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { register as registerURL } from '../config/routes';
import { useForm, useRequiredFieldsValidation, useFetch } from '../utils/customHooks';
import { PasswordFields } from '../components';

const fields = ['name', 'lastName', 'email'];

const Register: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [signupResponse, signupRequest] = useFetch();
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

  const signup = (): void => {
    signupRequest(registerURL, 'post', registerForm);
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
        variant="contained"
        color="primary"
        onClick={submit}
        size="large"
      >
        {t('buttons.register')}
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
