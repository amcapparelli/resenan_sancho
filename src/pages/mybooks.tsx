/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import useForm from '../utils/customHooks/useForm';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import { registerBook as URL } from '../config/routes';

interface Response {
  success: boolean,
  message: string
}

const Mybooks: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [bookForm, setBookForm] = useForm({
    cover: undefined,
    formats: [],
    datePublished: undefined,
    author: user._id,
  });
  const uploadCover = async ({ target }: any) => {
    const { files } = target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'resenan_sancho');

    const imageResponse = await fetch('https://api.cloudinary.com/v1_1/dnhkw9n4n/image/upload',
      {
        method: 'POST',
        body: data,
      });
    const file = await imageResponse.json();
    setBookForm('cover', file.secure_url);
  };
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
      setResponse({ message, success });
    } catch (error) {
      setResponse(error);
    }
  };
  return (
    <MyProfileLayout
      title={t('titles.mybooks')}
    >
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
          {
            bookForm.cover
            && <StyledImageContainer src={bookForm.cover} alt="Cover" />
          }
        </StyledFirstColumnContainer>
        <StyledSecondColumnContainer>
          {['title', 'author', 'editorial'].map((text) => (
            <TextField
              id="outlined-basic"
              disabled={text === 'author'}
              defaultValue={text === 'author' ? `${user.name} ${user.lastName}` : undefined}
              label={t(`booksForm.${text}`)}
              name={text}
              fullWidth
              onChange={({ target: { name, value } }) => setBookForm(name, value)}
              variant="outlined"
              size="small"
            />
          ))}
          <TextField
            id="standard-full-width"
            label="Sinopsis"
            multiline
            style={{ margin: 8 }}
            name="sinopsis"
            helperText="¡no hagas spoiler!"
            fullWidth
            rows="4"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={({ target: { name, value } }) => setBookForm(name, value)}
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
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </StyledSecondColumnContainer>
        <StyledThirdColumnContainer>
          <InputLabel id="demo-simple-select-autowidth-label">Género Literario</InputLabel>
          <Select
            onChange={({ target: { value } }) => setBookForm('genre', value)}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Género Literario
            </MenuItem>
            {
              ['thriller', 'terror', 'policial'].map((text) => (
                <MenuItem value={text}>{text}</MenuItem>
              ))
            }
          </Select>
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
          />
          <FormLabel component="legend">Formatos disponibles:</FormLabel>
          <FormGroup>
            {['ePUB', 'papel', 'mobi', 'PDF', 'audiolibro'].map((format) => (
              <FormControlLabel
                control={(
                  <Checkbox
                    onChange={({ target: { name } }) => setBookForm('formats', [...bookForm.formats, name])}
                    name={format}
                    color="primary"
                  />
                )}
                label={format}
              />
            ))}
          </FormGroup>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={registerBook}
          >
            {t('buttons.registerBook')}
          </Button>
        </StyledThirdColumnContainer>
      </StyledFormContainer>
    </MyProfileLayout>
  );
};

const StyledFormContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 1fr 2.5fr 1fr;
  grid-gap: 2rem;
`;

const StyledFirstColumnContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 1fr 3fr;
  justify-items: center;
  grid-gap: 1rem;
`;

const StyledSecondColumnContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
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

export default Mybooks;
