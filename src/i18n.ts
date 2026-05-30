import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
// Bundled resources: imported at build time so translations are available
// synchronously during SSR, preventing React hydration mismatches caused by
// the async HttpBackend + browser LanguageDetector combination.
import esCommon from '../public/static/locales/es/common.json';
import enCommon from '../public/static/locales/en/common.json';

if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      resources: {
        es: { common: esCommon },
        en: { common: enCommon },
      },
      lng: 'es',
      fallbackLng: 'es',
      supportedLngs: ['es', 'en'],
      defaultNS: 'common',
      ns: ['common'],
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18next;
