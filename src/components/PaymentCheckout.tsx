/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import styledComponents from 'styled-components';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Avatar,
  Card,
  CardContent,
  Button,
  Modal,
  FormHelperText,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PaymentIcon from '@material-ui/icons/Payment';
import ReactGA from 'react-ga';
import { trackingId } from '../utils/constants/GATrackingID';
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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  paper: {
    position: 'absolute',
    width: '40%',
    backgroundColor: '#525f7f',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  large: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    alignContent: 'center',
    justifySelf: 'center',
    justifyContent: 'center',
  },
}));

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
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const elements = useElements();
  const stripe = useStripe();
  const [clicked, setClicked] = useState(false);
  const [cardError, setCardError] = useState(null);
  const [response, setResponse] = useState({
    success: undefined,
    message: '',
  });

  useEffect(() => {
    ReactGA.initialize(trackingId);
  }, []);

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
        <div style={modalStyle} className={classes.paper}>
          <StyledForm onSubmit={handleSubmit}>
            <Avatar alt="cover" src={image} className={classes.large} />
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
        </div>
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
