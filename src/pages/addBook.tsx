/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Button,
  Collapse,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { useForm, useUploadImages, useRequiredFieldsValidation } from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import { registerBook as URL } from '../config/routes';
import { FormatsCheckBoxSelector } from '../components';
import { BookForm, BookFormErrors } from '../interfaces/books';
import genres from '../utils/constants/genres';

interface Response {
  success: boolean,
  message: string,
}

const AddBookForm: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  const initForm: BookForm = {
    title: '',
    cover: '',
    formats: [],
    datePublished: '',
    author: user._id,
    synopsis: '',
    genre: '',
    pages: '',
  };
  const [bookForm, setBookForm] = useForm(initForm);

  const initErrors: BookFormErrors = {
    title: '',
    cover: '',
    formats: '',
    datePublished: '',
    author: '',
    synopsis: '',
    editorial: '',
    genre: '',
    pages: '',
  };
  const [errors, validateRequiredFields] = useRequiredFieldsValidation(initErrors);

  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [open, setOpen] = useState(false);

  const [coverURL, uploadCover] = useUploadImages(initForm.cover);
  useEffect(() => {
    setBookForm('cover', coverURL);
  }, [coverURL]);

  const registerBook = async (): Promise<void> => {
    try {
      const res = await fetch(URL, {
        method: 'post',
        body: JSON.stringify({ ...bookForm }),
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

  const submit = () => {
    const requiredFields = ['title', 'synopsis', 'genre', 'cover', 'pages', 'formats', 'datePublished'];
    validateRequiredFields(bookForm, requiredFields, registerBook);
  };
  return (
    <MyProfileLayout
      title={t('titles.mybooks')}
    >
      <Card>
        <StyledFormContainer>
          <StyledFirstColumnContainer>
            <StyledInputFile
              accept="image/*"
              id="raised-button-file"
              multiple
              type="file"
              onChange={(e) => uploadCover(e)}
            />
            <StyledLabel htmlFor="raised-button-file">
              Subir Portada
            </StyledLabel>
            <FormHelperText error>{errors.cover}</FormHelperText>
            {
              bookForm.cover
              && <StyledImageContainer src={bookForm.cover} alt="Cover" />
            }
          </StyledFirstColumnContainer>
          <StyledSecondColumnContainer>
            {['title', 'author', 'editorial'].map((text) => (
              <TextField
                defaultValue={text === 'author' ? `${user.name} ${user.lastName}` : undefined}
                label={t(`booksForm.${text}`)}
                name={text}
                fullWidth
                onChange={({ target: { name, value } }) => setBookForm(name, value)}
                variant={text === 'author' ? 'filled' : 'outlined'}
                size="small"
                required={text !== 'editorial'}
                placeholder={text === 'editorial' ? 'Dejalo en blanco si eres autor independiente' : ''}
                error={errors[text].length > 0}
                helperText={errors[text]}
                InputProps={{
                  readOnly: (text === 'author'),
                }}
              />
            ))}
            <TextField
              id="standard-full-width"
              label="Synopsis"
              multiline
              style={{ margin: 8 }}
              name="synopsis"
              helperText={errors.synopsis || '¡no hagas spoiler!'}
              fullWidth
              rows="4"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={({ target: { name, value } }) => setBookForm(name, value)}
              required
              error={errors.synopsis.length > 0}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Fecha de publicación"
                  format="MM/dd/yyyy"
                  value={bookForm.datePublished || null}
                  name="datePublished"
                  onChange={(date) => setBookForm('datePublished', date)}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  required
                />
              </Grid>
              <FormHelperText error>{errors.datePublished}</FormHelperText>
            </MuiPickersUtilsProvider>
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
          </StyledSecondColumnContainer>
          <StyledThirdColumnContainer>
            <Select
              onChange={({ target: { value } }) => setBookForm('genre', value)}
              displayEmpty
              value={bookForm.genre}
              error={errors.genre.length > 0}
            >
              <MenuItem value="" disabled>
                Género Literario
              </MenuItem>
              {
                genres.map(({ name, code }) => (
                  <MenuItem value={code}>{t(`genres.${name}`)}</MenuItem>
                ))
              }
            </Select>
            <FormHelperText error>{errors.genre}</FormHelperText>
            <TextField
              id="standard-number"
              label="Cantidad de páginas"
              type="number"
              name="pages"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={({ target: { name, value } }) => setBookForm(name, value)}
              required
              error={errors.pages.length > 0}
              helperText={errors.pages}
            />
            <FormatsCheckBoxSelector
              errors={errors.formats}
              options={['ePUB', 'papel', 'mobi', 'PDF', 'audiolibro']}
              onChange={(
                { target: { name } }: React.ChangeEvent<HTMLInputElement>,
              ) => setBookForm('formats', [...bookForm.formats, name])}
              title="Formatos disponibles:"
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={submit}
            >
              {t('buttons.registerBook')}
            </Button>

          </StyledThirdColumnContainer>
        </StyledFormContainer>
      </Card>
    </MyProfileLayout>
  );
};

const StyledFormContainer = styledComponents(CardContent)`
  display: grid;
  grid-template-columns: 0.70fr 2fr 1fr;
  grid-gap: 2rem;
`;

const StyledFirstColumnContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 0.2fr 0.1fr 3fr;
  justify-items: center;
  grid-gap: 1rem;
`;

const StyledSecondColumnContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  padding: 3% 3% 3% 0;
`;

const StyledThirdColumnContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`;

const StyledImageContainer = styledComponents.img`
  width: 70%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
`;

const StyledInputFile = styledComponents.input`
  display: none;
`;

const StyledLabel = styledComponents.label`
  color: ${(props) => props.theme.contrastText};
  border-radius: 20px;
  padding: 2%;
  width: 50%;
  align-self: flex-start;
  text-align: center;
  background-color: ${(props) => props.theme.main};
  :hover{
    cursor: pointer;
  }
`;

export default AddBookForm;
