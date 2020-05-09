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
import Alert from '@material-ui/lab/Alert';
import {
  useForm,
  useFetch,
} from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import { ModalDialog } from '.';
import { orderBook as URL } from '../config/routes';

interface MyProps {
  open: boolean
  onClose: Function,
  book: string,
}

const ModalContact: React.FC<MyProps> = ({ open, onClose, book }: MyProps): JSX.Element => {
  const { user } = useContext(UserContext);
  const [orderBookResponse, orderBookRequest, loading] = useFetch();
  const [contactForm, setContactForm, loadContactForm] = useForm({});
  const [copiesOrdered, setCopiesOrdered] = useState<number>(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    loadContactForm({
      message: '',
      book,
      reviewer: user._id,
    });
  }, [book, user._id]);

  useEffect(() => {
    if (orderBookResponse.success) setCopiesOrdered(1);
  }, [orderBookResponse.success]);

  const handleSubmit = () => {
    orderBookRequest(URL, 'post', contactForm);
  };

  const handleCloseModal = () => {
    onClose(copiesOrdered);
    setTermsAccepted(false);
  };

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
          disabled={
            !termsAccepted
            || loading
            || copiesOrdered > 0
            || contactForm.message.length === 0
          }
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSubmit}
        >
          {`Envi${loading ? 'ando' : 'ar'}`}
        </Button>
      </StyledButtonContainer>
      {
        !loading && orderBookResponse.message
        && (
          <StyledAlert variant="filled" severity={orderBookResponse.success ? 'success' : 'error'}>
            {orderBookResponse.message}
          </StyledAlert>
        )
      }
    </>
  );
  return (
    <ModalDialog
      open={open}
      onClose={handleCloseModal}
      content={content}
    />
  );
};

const StyledButtonContainer = styledComponents.div`
  margin-left: 45%;
`;

const StyledAlert = styledComponents(Alert)`
  width: 40%;
  margin-top: 2%;
  margin-left: 30%;
`;

export default ModalContact;
