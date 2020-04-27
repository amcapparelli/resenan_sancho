/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
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
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  useForm,
  useUploadImages,
  useRequiredFieldsValidation,
  useFetchBook,
  useFetch,
} from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import { registerBook as URL } from '../config/routes';
import { FormatsCheckBoxSelector, GenresSelector } from '../components';
import { BookForm, BookFormErrors } from '../interfaces/books';

interface Response {
  success: boolean,
  message: string,
}

const AddBookForm: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { query: { book } } = useRouter();
  const { user } = useContext(UserContext);
  const [state, fetchBook] = useFetchBook();
  const [registerBookResponse, registerBookRequest] = useFetch();

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
  const [bookForm, setBookForm, loadForm] = useForm(initForm);

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
  const [open, setOpen] = useState(false);

  const [coverURL, uploadCover] = useUploadImages(initForm.cover);

  useEffect(() => {
    setBookForm('cover', coverURL);
  }, [coverURL]);

  useEffect(() => {
    if (book) fetchBook(book);
  }, [book]);

  useEffect(() => {
    const {
      title,
      synopsis,
      cover,
      editorial,
      formats,
      genre,
      pages,
      datePublished,
    } = state;
    loadForm({
      ...initForm,
      title,
      synopsis,
      cover,
      editorial,
      formats,
      genre,
      pages,
      datePublished,
    });
  }, [state]);

  useEffect(() => {
    if (registerBookResponse !== undefined) setOpen(true);
  }, [registerBookResponse.message]);

  const registerBook = async (): Promise<void> => {
    if (!book) {
      registerBookRequest(URL, 'post', bookForm);
    } else {
      registerBookRequest(`${URL}/${book}`, 'put', bookForm);
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
              onChange={(e) => uploadCover(e, 'covers')}
            />
            <StyledLabel htmlFor="raised-button-file">
              {t('buttons.uploadCover')}
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
                value={text !== 'author' ? bookForm[text] : `${user.name} ${user.lastName}`}
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
              value={bookForm.synopsis}
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
              registerBookResponse.message
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
                    severity={registerBookResponse.success ? 'success' : 'error'}
                  >
                    {registerBookResponse.message}
                  </Alert>
                </Collapse>
              )
            }
          </StyledSecondColumnContainer>
          <StyledThirdColumnContainer>
            <GenresSelector
              genreSelected={bookForm.genre}
              onChange={(
                { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
              ) => setBookForm(name, value)}
              errors={errors.genre}
            />
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
              value={bookForm.pages}
            />
            <FormatsCheckBoxSelector
              formatsSelected={bookForm.formats}
              errors={errors.formats}
              options={['ePUB', 'papel', 'mobi', 'PDF', 'audiolibro']}
              onChange={(
                { target: { name, checked } }: React.ChangeEvent<HTMLInputElement>,
              ) => setBookForm('formats',
                checked
                  ? [...bookForm.formats, name]
                  : [...bookForm.formats.filter((format: string) => format !== name)])}
              title="Formatos disponibles:"
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={submit}
            >
              {!book ? t('buttons.registerBook') : 'actualizar libro'}
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
  padding-top: 1rem;
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
  padding-top: 1rem;
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
  border-radius: 5px;
  border:2px solid #fff;
  box-shadow: 2px 2px 5px #ccc;
  padding: 5%;
  width: 70%;
  align-self: flex-start;
  text-align: center;
  font-weight: 600;
  background-color: ${(props) => props.theme.main};
  :hover{
    cursor: pointer;
    background-color: ${(props) => props.theme.dark};
    color: ${(props) => props.theme.main};
  }
`;

export default AddBookForm;
