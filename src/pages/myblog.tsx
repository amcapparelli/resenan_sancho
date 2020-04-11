/* eslint-disable no-underscore-dangle */
import React, { useState, useContext } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Collapse,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import { MyProfileLayout } from '../components/Layouts';
import { MyMediasForm } from '../components';
import { useForm } from '../utils/customHooks';
import UserContext from '../store/context/userContext/UserContext';
import genres from '../utils/constants/genres';
import { registerBlog as URL } from '../config/routes';

interface Response {
  success: boolean,
  message: string,
}

interface MediaForm {
  author: string,
  genres: Array<string>,
}

const myblog: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const initForm: MediaForm = {
    author: user._id,
    genres: [],
  };
  const [mediaForm, setMediaForm] = useForm(initForm);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [open, setOpen] = useState(false);

  const submit = async (): Promise<void> => {
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

  return (
    <MyProfileLayout
      title={t('titles.myblog')}
    >
      <>
        <Typography variant="h3" align="center">{t('titles.whereDoYouReview')}</Typography>
        <StyledListContainer>
          {['blog', 'booktube', 'bookstagram', 'goodreads', 'amazon'].map(
            (media) => (
              <MyMediasForm
                media={media}
                onChange={(
                  { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
                ) => setMediaForm(media, { ...mediaForm[media], [name]: value })}
              />
            ),
          )}
        </StyledListContainer>
        <Typography variant="h3" align="center">{t('titles.whichGenres')}</Typography>
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

export default myblog;
