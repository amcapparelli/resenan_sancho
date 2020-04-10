export enum AvailableGenres {
  adventure = 'adventure',
  biography = 'biography',
  cienceFiction = 'cienceFiction',
  crime = 'crime',
  erotica = 'erotica',
  fantasy = 'fantasy',
  forChildren = 'forChildren',
  juvenile = 'juvenile',
  historicalFiction = 'historicalFiction',
  humor = 'humor',
  poetry = 'poetry',
  policial = 'policial',
  psychologicalDrama = 'psychologicalDrama',
  romantic = 'romantic',
  suspense = 'suspense',
  terror = 'terror',
  thriller = 'thriller',
}

export interface Genre {
  name: keyof typeof AvailableGenres,
  code: string
}
