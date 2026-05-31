/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import styledComponents from 'styled-components';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Button,
  Modal,
  FormHelperText,
  Typography,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import PaymentIcon from '@mui/icons-material/Payment';
import ReactGA from "react-ga4";
import UserContext from '../store/context/userContext/UserContext';
import { paymentCheckout } from '../config/routes';

interface MyProps {
  open: boolean,
  onClose: Function
  amount: number
  image: string
  description: string
  chosenPromo: number
  bookId: string
  bookTitle: string
}

const PaymentCheckout: React.FC<MyProps> = ({
  amount,
  bookId,
  open,
  onClose,
  image,
  description,
  chosenPromo,
  bookTitle,
}: MyProps): JSX.Element => {
  const { user } = useContext(UserContext);
  const elements = useElements();
  const stripe = useStripe();
  const [clicked, setClicked] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [response, setResponse] = useState({
    success: undefined,
    message: '',
  });

  const handleChange = (event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setClicked(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (!error) {
      try {
        const res = await fetch(paymentCheckout, {
          method: 'post',
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'include',
          body: JSON.stringify({
            id: paymentMethod.id,
            amount: amount * 100,
            chosenPromo,
            bookId,
            author: user._id,
          }),
          headers: {
            'Content-Type': 'application/json',
            'access-token': user.token,
          },
        });
        const resJSON = await res.json();
        setResponse(resJSON);
        ReactGA.event({
          category: 'payment',
          action: `New Payment: ${amount}, book: ${bookTitle}`,
        });
      } catch (err) {
        setResponse(err);
      } finally {
        setClicked(false);
      }
    }
    console.log(error);
    setClicked(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => onClose && onClose()}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40%',
          backgroundColor: '#525f7f',
          border: '2px solid #000',
          boxShadow: 5,
          p: '16px 32px 24px',
        }}>
          <StyledForm onSubmit={handleSubmit}>
            <Avatar
              alt="cover"
              src={image}
              sx={{
                width: (t) => t.spacing(9),
                height: (t) => t.spacing(9),
                alignContent: 'center',
                justifySelf: 'center',
                justifyContent: 'center',
              }}
            />
            <Typography variant="body1" color="primary" align="center">{description}</Typography>
            <Typography variant="body1" color="secondary" align="center">Pago con tarjeta: </Typography>
            <Card>
              <CardContent>
                <CardElement
                  id="card-element"
                  onChange={handleChange}
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        color: '#32325d',
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a',
                      },
                    },
                  }}
                />
              </CardContent>
            </Card>
            <FormHelperText error>{cardError}</FormHelperText>
            <StyledButton
              variant="contained"
              color="secondary"
              disabled={!stripe || clicked}
              startIcon={<PaymentIcon />}
              type="submit"
            >
              {`Pagar ${amount}0€`}
            </StyledButton>
          </StyledForm>
          {
            response.message
            && (
              <Alert variant="filled" severity={response.success ? 'success' : 'error'}>
                {response.message}
              </Alert>
            )
          }
        </Box>
      </Modal>
    </div>
  );
};

const StyledForm = styledComponents.form`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 20px;
`;

const StyledButton = styledComponents(Button)`
  width: 40%;
  justify-self: center;
`;
export default PaymentCheckout;
