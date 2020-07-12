/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from 'react';
import styledComponents from 'styled-components';
import {
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>();
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    setLanguage(i18n.language);
  }, []);

  return (
    <StyledLanguageSelector>
      <Typography variant="body1" display="inline">{t('components.languageSelector.chooseLanguage')}: </Typography>
      <StyledButton type="button" onClick={() => setLanguage('es')}>
        <Typography variant="body1" display="inline" color={language === 'es' ? 'primary' : 'inherit'}>
          ESP
        </Typography>
      </StyledButton>
      <span> | </span>
      <StyledButton type="button" onClick={() => setLanguage('en')}>
        <Typography variant="body1" display="inline" color={language === 'en' ? 'primary' : 'inherit'}>
          ENG
        </Typography>
      </StyledButton>
    </StyledLanguageSelector>
  );
};

const StyledLanguageSelector = styledComponents.div`
  text-align: right;
  margin-right: 5%;
`;

const StyledButton = styledComponents.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
`;

export default LanguageSelector;
