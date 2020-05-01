/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import React from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Divider } from '@material-ui/core';
import { GenresSelector, FormatsSelector } from '.';

interface MyProps {
  onChange: Function,
  onClick: Function,
  genreSelected: string,
  formatSelected: string,
  text: string
}

const Filters = ({
  onChange,
  onClick,
  genreSelected,
  formatSelected,
  text,
}: MyProps) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledFiltersContainer>
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
        <StyledButton
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
  align-self: center;
`;
const StyledFiltersContainer = styledComponents.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  margin-left: 10%;
  margin-bottom: 1%;
`;

const StyledButton = styledComponents(Button)`
  width: 50%;
  height: 50%;
  align-self: center;
`;

export default Filters;
