/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Button,
  Collapse,
  IconButton,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { MyProfileLayout } from '../components/Layouts';
import { MyMediasForm, FormatsCheckBoxSelector } from '../components';
import { useForm, useRequiredFieldsValidation } from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import genres from '../utils/constants/genres';
import { registerBlog as URL } from '../config/routes';
import { AvailableMedias, MediaForm } from '../interfaces/mediaForm';
import { Response } from '../interfaces/response';

const Myblog: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const initForm: MediaForm = {
    author: user._id,
    genres: [],
    formats: [],
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
    description: '',
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

  const medias = Object.values(AvailableMedias);
  const submit = () => {
    const requiredFields = ['genres', 'medias', 'description'];
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
    // TODO: GET ERRORS AND SHOW THEM ON MEDIA CARDS INPUTS
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
        <StyledSection>
          <Typography variant="h3" align="center">{t('titles.whichGenres')}</Typography>
          <FormHelperText error>{errors.genres}</FormHelperText>
          <Card>
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
          </Card>
        </StyledSection>
        <StyledSection>
          <Typography variant="h3" align="center">{t('titles.describeYourself')}</Typography>
          <Card>
            <CardContent>
              <TextField
                id="standard-full-width"
                label="Description"
                multiline
                style={{ margin: 8 }}
                name="description"
                helperText={errors.description}
                fullWidth
                rows="4"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={({ target: { name, value } }) => setMediaForm(name, value)}
                required
                error={errors.description.length > 0}
              />
            </CardContent>
          </Card>
        </StyledSection>
        <StyledSection>
          <Typography variant="h3" align="center">{t('titles.chooseFormats')}</Typography>
          <Card>
            <CardContent>
              <StyledCenteredContainer>
                <FormatsCheckBoxSelector
                  errors={errors.formats}
                  options={['ePUB', 'papel', 'mobi', 'PDF', 'audiolibro']}
                  onChange={(
                    { target: { name } }: React.ChangeEvent<HTMLInputElement>,
                  ) => setMediaForm('formats', [...mediaForm.formats, name])}
                />
              </StyledCenteredContainer>
            </CardContent>
          </Card>
        </StyledSection>
        <StyledCenteredContainer>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={submit}
          >
            {t('buttons.save')}
          </Button>
        </StyledCenteredContainer>
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
  margin-left: 0;  
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1%;
`;

const StyledSection = styledComponents.section`
  margin-top: 1.5rem;
`;

const StyledCenteredContainer = styledComponents.div`
  margin-top: 1rem;
  margin-left: 45%;
`;

const StyledGenresContainer = styledComponents(CardContent)`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1%;
`;

export default Myblog;
