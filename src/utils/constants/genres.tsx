import { AvailableGenres, Genre } from '../../interfaces/genres';

const {
  adventure,
  biography,
  cienceFiction,
  crime,
  erotica,
  fantasy,
  forChildren,
  juvenile,
  historicalFiction,
  humor,
  poetry,
  policial,
  psychologicalDrama,
  romantic,
  suspense,
  terror,
  thriller,
} = AvailableGenres;

const genres: Array<Genre> = [
  { name: adventure, code: 'ADV' },
  { name: biography, code: 'BIO' },
  { name: cienceFiction, code: 'CIF' },
  { name: crime, code: 'CRI' },
  { name: erotica, code: 'ERO' },
  { name: fantasy, code: 'FAN' },
  { name: forChildren, code: 'FCH' },
  { name: juvenile, code: 'JUV' },
  { name: historicalFiction, code: 'HIF' },
  { name: humor, code: 'HUM' },
  { name: poetry, code: 'POE' },
  { name: policial, code: 'POL' },
  { name: psychologicalDrama, code: 'PSD' },
  { name: romantic, code: 'ROM' },
  { name: suspense, code: 'SUS' },
  { name: terror, code: 'TER' },
  { name: thriller, code: 'THR' },
];

export default genres;
