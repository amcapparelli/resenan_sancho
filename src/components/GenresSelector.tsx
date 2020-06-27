import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from '@material-ui/core';
import genres from '../utils/constants/genres';

interface MyProps {
  genreSelected: string
  onChange: Function
  errors: string
}

const GenresSelector: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { t } = useTranslation();
  const { genreSelected, onChange, errors } = props;

  return (
    <FormControl variant="outlined">
      <InputLabel
        shrink={!!genreSelected}
        htmlFor="genresSelector"
      >
        {t('components.genresSelector.title')}
      </InputLabel>
      <Select
        fullWidth
        value={genreSelected}
        onChange={(e) => onChange && onChange(e)}
        error={errors.length > 0}
        label={t('components.genresSelector.title')}
        inputProps={{
          name: 'genre',
          id: 'genresSelector',
        }}
        input={
          (
            <OutlinedInput
              name="genre"
              id="outlined-country-simple"
              notched
              labelWidth={genreSelected ? 110 : 0}
            />
          )
        }
      >
        <MenuItem value="" disabled>
          {t('components.genresSelector.title')}
        </MenuItem>
        {
          genres
            .sort((a, b) => {
              const genreA = t(`genres.${a.name}`);
              const genreB = t(`genres.${b.name}`);
              let comparison = 0;
              if (genreA > genreB) {
                comparison = 1;
              } else if (genreA < genreB) {
                comparison = -1;
              }
              return comparison;
            })
            .map(({ name, code }) => (
              <MenuItem value={code}>{t(`genres.${name}`)}</MenuItem>
            ))
        }
      </Select>
    </FormControl>
  );
};

export default GenresSelector;
