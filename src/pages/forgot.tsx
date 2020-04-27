import React, { useState } from 'react';
import styledComponents from 'styled-components';
import { Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useForm } from '../utils/customHooks';
import { forgotPass } from '../config/routes';
import { Response } from '../interfaces/response';

const reset = () => {
  const [resetForm, setResetForm] = useForm({});
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const resetRequest = async (): Promise<void> => {
    try {
      const res = await fetch(forgotPass, {
        method: 'post',
        body: JSON.stringify({ ...resetForm }),
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
  return (
    <StyledForm>
      <TextField
        id="standard-password-input"
        label="email"
        name="email"
        type="email"
        variant="outlined"
        onChange={({ target: { name, value } }) => setResetForm(name, value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={resetRequest}
        size="large"
      >
        reset
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
  width: 30%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default reset;
