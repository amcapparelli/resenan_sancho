import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  OutlinedInput,
} from '@material-ui/core';
import formats from '../utils/constants/formats';


interface MyProps {
  formatSelected: string
  onChange: Function
  errors: string
}

const FormatsSelector: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { t } = useTranslation();
  const { formatSelected, onChange, errors } = props;

  return (
    <FormControl variant="outlined">
      <InputLabel
        shrink={!!formatSelected}
        htmlFor="formatsSelector"
      >
        {t('components.formatsSelector.title')}
      </InputLabel>
      <Select
        fullWidth
        value={formatSelected}
        onChange={(e) => onChange && onChange(e)}
        error={errors.length > 0}
        label={t('components.formatsSelector.title')}
        inputProps={{
          name: 'format',
          id: 'formatsSelector',
        }}
        input={
          (
            <OutlinedInput
              name="format"
              id="outlined-country-simple"
              notched
              labelWidth={formatSelected ? 65 : 0}
            />
          )
        }
      >
        <MenuItem value="">
          {t('components.formatsSelector.all')}
        </MenuItem>
        {
          formats.map((format) => (
            <MenuItem value={format}>{format}</MenuItem>
          ))
        }
      </Select>
    </FormControl>
  );
};

export default FormatsSelector;
