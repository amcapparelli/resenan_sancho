import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useForm, useFetch } from '../utils/customHooks';
import { PasswordFields, StyledLink } from '../components';
import { resetPass as resetPassURL } from '../config/routes';

const reset = () => {
  const { t } = useTranslation();
  const { query: { resetToken, user } } = useRouter();
  const [resetForm, setResetForm] = useForm({
    password: '',
    repeatPassword: '',
  });
  const [resetResponse, resetRequest] = useFetch();
  const [passwordIsValid, setPasswordIsValid] = useState<boolean>(false);
  const [repeatPasswordIsValid, setRepeatPasswordIsValid] = useState<boolean>(false);
  const [passwordErrors, setPasswordErrors] = useState<string>('');
  useEffect(() => {
    const { password } = resetForm;
    const rules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (password.match(rules)) {
      setPasswordIsValid(true);
    } else {
      setPasswordIsValid(false);
    }
  }, [resetForm.password]);

  useEffect(() => {
    const { password, repeatPassword } = resetForm;
    if (password === repeatPassword) setRepeatPasswordIsValid(true);
    if (password !== repeatPassword) setRepeatPasswordIsValid(false);
  }, [resetForm.repeatPassword]);

  const resetPassword = (): void => {
    if (!passwordIsValid || !repeatPasswordIsValid) {
      return setPasswordErrors('la contraeña no es válida');
    }
    setPasswordErrors('');
    return resetRequest(`${resetPassURL}/${resetToken}/${user}`, 'post', resetForm);
  };

  return (
    <StyledForm>
      <PasswordFields
        onChange={(
          { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
        ) => setResetForm(name, value)}
        passwordErrors={passwordErrors}
        passwordIsValid={passwordIsValid}
        repeatPasswordIsValid={repeatPasswordIsValid}
        passwordLength={resetForm.password.length}
        repeatPasswordLength={resetForm.repeatPassword.length}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={resetPassword}
        size="large"
      >
        Reset
      </Button>
      {
        resetResponse.message
        && (
          <Alert variant="filled" severity={resetResponse.success ? 'success' : 'error'}>
            {resetResponse.message}
          </Alert>
        )
      }
      {
        resetResponse.success
        && (
          <StyledLink
            anchor={t('link.backToLogin')}
            href="/login"
          />
        )
      }
    </StyledForm>
  );
};

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

export default reset;
