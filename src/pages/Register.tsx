import React, { useState } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, TextField, FormHelperText } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
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
  const [registerForm, setRegisterForm] = useForm({});
  const [errors, setErrors] = useState(initialErrors);

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
      {['name', 'lastName', 'email', 'password', 'repeatPassword'].map((text) => (
        <>
          <TextField
            key={text}
            label={t(`form.${text}`)}
            name={text}
            type={(text === 'password' || text === 'repeatPassword') ? 'password' : 'text'}
            variant="outlined"
            onChange={({ target: { name, value } }) => setRegisterForm(name, value)}
          />
          {
            text === 'repeatPassword'
            && <FormHelperText error>{errors.repeatPassword}</FormHelperText>
          }
        </>
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

const StyledButton = styledComponents(Button)`
  width: 40%;
  justify-self: center;
`;
export default Register;
