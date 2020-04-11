import React from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  FormControlLabel,
  Switch,
  Typography,
} from '@material-ui/core';
import { MyProfileLayout } from '../components/Layouts';
import { MyMediasForm } from '../components';
import { useForm } from '../utils/customHooks';
import genres from '../utils/constants/genres';

export interface MediaForm {
  genres: Array<string>,
}

const initForm: MediaForm = {
  genres: [],
};

const myblog: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [mediaForm, setMediaForm] = useForm(initForm);
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
