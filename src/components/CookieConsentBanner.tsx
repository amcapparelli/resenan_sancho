import React, { useEffect, useState } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import StyledLink from './StyledLink';
import { getStoredConsent, storeConsent, updateConsent } from '../utils/analytics/consent';

const CookieConsentBanner = (): JSX.Element | null => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Runs client-only, after the first paint: `getStoredConsent` reads
    // `localStorage`, which isn't available during SSR and would otherwise
    // cause a hydration mismatch if checked on the initial render.
    if (getStoredConsent() === null) {
      setIsVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'granted' | 'denied') => {
    updateConsent(choice);
    storeConsent(choice);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <StyledBanner role="region" aria-label={t('cookieConsent.title')}>
      <Text>{t('cookieConsent.body')}</Text>
      <Actions>
        <StyledLink anchor={t('cookieConsent.moreInfo')} href="/legal" />
        <DeclineButton variant="outlined" size="medium" onClick={() => handleChoice('denied')}>
          {t('cookieConsent.decline')}
        </DeclineButton>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={() => handleChoice('granted')}
        >
          {t('cookieConsent.accept')}
        </Button>
      </Actions>
    </StyledBanner>
  );
};

const StyledBanner = styledComponents.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1300;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px 24px;
  padding: 16px 24px;
  background: ${({ theme }) => theme.appBackground};
  border-top: 1px solid ${({ theme }) => theme.lightBorder};
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
`;

const Text = styledComponents.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 0.95rem;
  color: ${({ theme }) => theme.ink};
  max-width: 640px;
`;

const Actions = styledComponents.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

// Same size as the accept button on purpose: both choices carry equal visual
// weight. They're told apart by fill vs. outline rather than by color, so
// accepting isn't nudged as the "default" path and no new color is added
// outside the theme. `color="primary"` (theme.main / theme.contrastText) is
// too light for outlined text on this banner's cream background, so this
// reuses `theme.ink` / `theme.lightBorder`, the same tokens the rest of the
// banner already uses.
const DeclineButton = styledComponents(Button)`
  && {
    color: ${({ theme }) => theme.ink};
    border-color: ${({ theme }) => theme.lightBorder};

    &:hover {
      border-color: ${({ theme }) => theme.brown};
      background-color: transparent;
    }
  }
`;

export default CookieConsentBanner;
