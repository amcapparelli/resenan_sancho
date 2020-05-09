/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import styledComponents from 'styled-components';
import { useRouter } from 'next/router';
import {
  Button,
  Typography,
} from '@material-ui/core';
import { ModalDialog } from '.';
import { deleteUser as URL } from '../config/routes';

interface MyProps {
  open: boolean
  onClose: Function,
}

const ModalDeleteAccount: React.FC<MyProps> = ({ open, onClose }: MyProps): JSX.Element => {
  const [responseDeleteRequest, setResponseDeleteRequest] = useState({
    success: undefined,
    message: '',
  });
  const router = useRouter();

  useEffect(() => {
    if (responseDeleteRequest.success) {
      router.push('/register');
    }
  }, [responseDeleteRequest.success]);

  const handleSubmit = async (): Promise<void> => {
    try {
      const res = await fetch(URL, {
        method: 'delete',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const resJSON = await res.json();
      setResponseDeleteRequest(resJSON);
    } catch (error) {
      setResponseDeleteRequest(error);
    }
  };

  const content: JSX.Element = (
    <>
      <Typography variant="h4" align="center">¿Seguro que quieres eliminar tu cuenta?</Typography>
      <Typography variant="subtitle1" align="center">Se borrarán también tus espacios literarios y tus libros.</Typography>
      <StyledButtonContainer>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => onClose && onClose()}
        >
          ¡Me quedo!
        </Button>
        <Button
          color="secondary"
          size="small"
          onClick={handleSubmit}
        >
          Borrar mi cuenta.
        </Button>
      </StyledButtonContainer>
    </>
  );
  return (
    <ModalDialog
      open={open}
      onClose={() => onClose && onClose()}
      content={content}
    />
  );
};

const StyledButtonContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10%;
  margin-top: 5%;
  margin-left: 30%;
  width: 40%
`;

export default ModalDeleteAccount;
