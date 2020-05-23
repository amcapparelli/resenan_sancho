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

const defaultMediaValues = {
  blog: { selected: false, url: '', name: '' },
  booktube: { selected: false, url: '', name: '' },
  bookstagram: { selected: false, url: '', name: '' },
  goodreads: { selected: false, url: '', name: '' },
  amazon: { selected: false, url: '', name: '' },
};

const MySpaces: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user, user: { reviewerInfo }, setUserLogged } = useContext(UserContext);
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [isEditing] = useState<boolean>(!!reviewerInfo);
  const getInitialMediaValues = !isEditing
    ? defaultMediaValues
    : Object.keys(AvailableMedias).reduce((object, key) => ({
      ...object,
      [key]: {
        selected: !!reviewerInfo[key],
        url: reviewerInfo[key] && reviewerInfo[key].url,
        name: reviewerInfo[key] && reviewerInfo[key].name,
      },
    }), defaultMediaValues);

  const initForm: MediaForm = {
    author: user._id,
    genres: isEditing ? reviewerInfo.genres : [],
    formats: isEditing ? reviewerInfo.formats : [],
    description: isEditing ? reviewerInfo.description : '',
    blog: getInitialMediaValues.blog,
    booktube: getInitialMediaValues.booktube,
    bookstagram: getInitialMediaValues.bookstagram,
    goodreads: getInitialMediaValues.goodreads,
    amazon: getInitialMediaValues.amazon,
  };
  const [mediaForm, setMediaForm] = useForm(initForm);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const initErrors = {
    genres: '',
    description: '',
  };
  const [errors, validateRequiredFields] = useRequiredFieldsValidation(initErrors);

  const medias = Object.keys(AvailableMedias);
  const registerMedias = async (): Promise<void> => {
    // Clean empty inputs when medias cards are not selected.
    const mediasFormClean = Object.entries(mediaForm).reduce(
      (acum, [key, value]: any) => (
        (medias.includes(key) && value.selected === false)
          ? acum : { ...acum, [key]: value }
      ), {},
    );
    try {
      const res = await fetch(URL, {
        method: isEditing || succeeded ? 'put' : 'post',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify({ ...mediasFormClean }),
        headers: { 'Content-Type': 'application/json' },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
        reviewer,
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
      if (success) {
        setUserLogged({ ...user, reviewerInfo: reviewer });
        setSucceeded(true);
      }
      setOpen(true);
    } catch (error) {
      setResponse(error);
      setOpen(true);
    }
  };

  const submit = () => {
    const requiredMediaFields: Array<string> = medias.flatMap((media) => [`${media}URL`, `${media}Name`]);
    const requiredFields = ['genres', 'medias', 'description', 'formats', ...requiredMediaFields];
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
      return {
        genres: mediaForm.genres,
        formats: mediaForm.formats,
        description: mediaForm.description,
        ...mediasSelected,
      };
    };
    validateRequiredFields(fieldToValidate(), requiredFields, registerMedias);
  };

  return (
    <MyProfileLayout
      title={t('titles.mySpaces')}
    >
      <>
        <Typography variant="h3" align="center">{t('titles.whereDoYouReview')}</Typography>
        <FormHelperText error>{errors.medias && 'debes seleccionar al menos uno'}</FormHelperText>
        <StyledListContainer>
          {medias.map(
            (media) => (
              <MyMediasForm
                errors={{ url: errors[`${media}URL`], name: errors[`${media}Name`] }}
                url={mediaForm[media].url}
                name={mediaForm[media].name}
                selected={mediaForm[media].selected}
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
                        checked={mediaForm.genres.includes(name)}
                        onChange={({ target: { checked } }) => setMediaForm('genres',
                          checked
                            ? [...mediaForm.genres, name]
                            : [...mediaForm.genres.filter((genre: string) => genre !== name)])}
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
          <FormHelperText>
            Algunas ideas para contestar a esta pregunta: Por ejemplo,
            el tipo de libros que te gusta, si sueles entrevistar a autores, si
            realizas sorteos entre tus lectores, si publicas tanto reseñas positivas
            como negativas, si tienes una escala de puntuación, el tiempo que te lleva
            una reseña desde que comienzas a leer el libro, etc.
          </FormHelperText>
          <Card>
            <CardContent>
              <TextField
                id="standard-full-width"
                label={t('titles.describeYourself')}
                multiline
                style={{ margin: 8 }}
                name="description"
                helperText={errors.description || `Caracteres restantes: ${(2000 - mediaForm.description.length)} `}
                fullWidth
                rows="4"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  maxLength: 1000,
                }}
                value={mediaForm.description}
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
                  options={['epub', 'papel', 'mobi', 'pdf', 'audiolibro']}
                  formatsSelected={mediaForm.formats}
                  onChange={(
                    { target: { name, checked } }: React.ChangeEvent<HTMLInputElement>,
                  ) => setMediaForm('formats',
                    checked
                      ? [...mediaForm.formats, name]
                      : [...mediaForm.formats.filter((format: string) => format !== name)])}
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
          <FormHelperText error>
            {Object.values(errors).some((error: string) => error.length > 0) && 'Revisa el formulario, tienes errores'}
          </FormHelperText>
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

export default MySpaces;
