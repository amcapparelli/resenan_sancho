const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
  defaultLanguage: 'es',
  otherLanguages: ['en'],
});

/* export default NextI18NextInstance

/* Optionally, export class methods as named exports */
/* export const {
  appWithTranslation,
  withTranslation,
} = NextI18NextInstance */
