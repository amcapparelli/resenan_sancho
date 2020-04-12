/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Collapse,
  IconButton,
  FormControlLabel,
  FormHelperText,
  Switch,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { MyProfileLayout } from '../components/Layouts';
import { MyMediasForm } from '../components';
import { useForm, useRequiredFieldsValidation } from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import genres from '../utils/constants/genres';
import { registerBlog as URL } from '../config/routes';
import { MediaForm } from '../interfaces/mediaForm';
import { Response } from '../interfaces/response';

const Myblog: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const initForm: MediaForm = {
    author: user._id,
    genres: [],
    blog: {
      selected: false,
    },
    booktube: {
      selected: false,
    },
    bookstagram: {
      selected: false,
    },
    goodreads: {
      selected: false,
    },
    amazon: {
      selected: false,
    },
  };
  const [mediaForm, setMediaForm] = useForm(initForm);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [open, setOpen] = useState(false);
  const initErrors = {
    genres: '',
  };
  const [errors, validateRequiredFields] = useRequiredFieldsValidation(initErrors);
  const registerMedias = async (): Promise<void> => {
    try {
      const res = await fetch(URL, {
        method: 'post',
        body: JSON.stringify({ ...mediaForm }),
        headers: { 'Content-Type': 'application/json' },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
      } = resJSON;
      console.log(resJSON);

      if (resJSON.error) {
        setResponse({
          message: resJSON.error.errors[Object.keys(resJSON.error.errors)[0]].message,
          success: false,
        });
        setOpen(true);
        return;
      }
      setResponse({ message, success });
      setOpen(true);
    } catch (error) {
      setResponse(error);
      setOpen(true);
    }
  };

  const medias = ['blog', 'booktube', 'bookstagram', 'goodreads', 'amazon'];
  const submit = () => {
    const requiredFields = ['genres', 'medias'];
    // Function to build an object for validation
    const fieldToValidate = () => {
      let mediasSelected = {};
      // Check each media card if selected to get its inputs and send them to validation hook.
      medias.forEach((media) => {
        if (mediaForm[media].selected) {
          mediasSelected = {
            ...mediasSelected,
            [`${media}URL`]: mediaForm[media].url,
            [`${media}Name`]: mediaForm[media].name,
          };
        }
      });
      // If no media is selected send empty array to validation hook.
      if (Object.entries(mediasSelected).length === 0) {
        return { genres: mediaForm.genres, medias: [] as string[] };
      }
      return { genres: mediaForm.genres, ...mediasSelected };
    };
    console.log(fieldToValidate());
    validateRequiredFields(fieldToValidate(), requiredFields, registerMedias);
  };

  return (
    <MyProfileLayout
      title={t('titles.myblog')}
    >
      <>
        <Typography variant="h3" align="center">{t('titles.whereDoYouReview')}</Typography>
        <FormHelperText error>{errors.medias && 'debes seleccionar al menos uno'}</FormHelperText>
        <StyledListContainer>
          {medias.map(
            (media) => (
              <MyMediasForm
                media={media}
                onSelect={() => setMediaForm(media,
                  { ...mediaForm[media], selected: !mediaForm[media].selected })}
                onChange={(
                  { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
                ) => setMediaForm(media, { ...mediaForm[media], [name]: value })}
              />
            ),
          )}
        </StyledListContainer>
        <Typography variant="h3" align="center">{t('titles.whichGenres')}</Typography>
        <FormHelperText error>{errors.genres}</FormHelperText>
        <StyledGenresContainer>
          {genres.map(
            ({ name, code }) => (
              <FormControlLabel
                control={(
                  <Switch
                    // checked={expanded}
                    onChange={() => setMediaForm('genres', [...mediaForm.genres, name])}
                    name={code}
                    color="primary"
                  />
                )}
                label={t(`genres.${name}`)}
              />
            ),
          )}
        </StyledGenresContainer>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={submit}
        >
          {t('buttons.save')}
        </Button>
        {
          response.message
          && (
            <Collapse in={open}>
              <Alert
                action={(
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                )}
                variant="filled"
                severity={response.success ? 'success' : 'error'}
              >
                {response.message}
              </Alert>
            </Collapse>
          )
        }
      </>
    </MyProfileLayout>
  );
};

const StyledListContainer = styledComponents.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1%;
`;

const StyledGenresContainer = styledComponents.ul`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1%;
`;

export default Myblog;
