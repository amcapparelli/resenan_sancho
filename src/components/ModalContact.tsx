/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect, useState } from 'react';
import styledComponents from 'styled-components';
import {
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  useForm,
} from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import { ModalDialog } from '.';

interface MyProps {
  open: boolean
  onClose: Function,
  book: string,
}

const ModalContact: React.FC<MyProps> = ({ open, onClose, book }: MyProps): JSX.Element => {
  const { user } = useContext(UserContext);
  const [contactForm, setContactForm, loadContactForm] = useForm({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  useEffect(() => {
    loadContactForm({
      message: '',
      book,
      reviewer: user._id,
    });
  }, [book]);
  const content: JSX.Element = (
    <>
      <Typography variant="h4" align="center">¡Contacta con el autor!</Typography>
      <Typography variant="body1" align="center">Envíale un mensaje personalizado:</Typography>
      <TextField
        label="Mensaje"
        multiline
        style={{ margin: 8 }}
        name="message"
        fullWidth
        rows="4"
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={({ target: { name, value } }) => setContactForm(name, value)}
      />
      <FormControlLabel
        control={(
          <Checkbox
            onChange={() => setTermsAccepted(!termsAccepted)}
            inputProps={{ 'aria-label': 'primary checkbox' }}

          />
        )}
        label="Al enviar el mensaje le facilitaremos tu email al autor para que se ponga en contacto contigo.
        Marca esta casilla si estás de acuerdo."
      />
      <StyledButtonContainer>
        <Button
          disabled={!termsAccepted}
          variant="contained"
          color="primary"
          size="large"
          onClick={() => { }}
        >
          Enviar
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
  margin-left: 45%;
`;
export default ModalContact;
