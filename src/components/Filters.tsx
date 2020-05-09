/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Divider,
  Typography,
  TextField,
} from '@material-ui/core';
import { GenresSelector, FormatsSelector } from '.';

interface MyProps {
  onChange: Function,
  onClick: Function,
  genreSelected: string,
  formatSelected: string,
  showInputSearch?: boolean,
  text: string
}

const Filters = ({
  onChange,
  onClick,
  genreSelected,
  formatSelected,
  text,
  showInputSearch,
}: MyProps) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledFiltersContainer id={showInputSearch ? 'reviewersFilters' : 'bookFilters'}>
        <StyledText variant="body2">{text}</StyledText>
        <GenresSelector
          onChange={onChange}
          genreSelected={genreSelected}
          errors=""
        />
        <FormatsSelector
          onChange={onChange}
          formatSelected={formatSelected}
          errors=""
        />
        {
          showInputSearch
          && (
            <TextField
              label="Texto"
              name="searchText"
              type="text"
              variant="outlined"
              helperText="Introduce un texto para buscar por el nombre del blog, canal o perfil"
              onChange={(e) => onChange && onChange(e)}
            />
          )
        }
        <StyledButton
          id={showInputSearch ? 'reviewersFilters' : 'bookFilters'}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => onClick && onClick()}
        >
          {t('buttons.filter')}
        </StyledButton>
      </StyledFiltersContainer>
      <Divider />
    </>
  );
};

const StyledText = styledComponents(Typography)`
  width: 50%;
  justify-self: right;
`;
const StyledFiltersContainer = styledComponents.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(${(props) => (props.id === 'reviewersFilters' ? 5 : 4)}, 1fr);
  margin-top: 2%;
  margin-bottom: 1%;
`;

const StyledButton = styledComponents(Button)`
  width: 50%;
  height: 50%;
  align-self: ${(props) => (props.id === 'reviewersFilters' ? 'flex-start' : 'center')};
`;

export default Filters;
