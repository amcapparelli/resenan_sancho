import React from 'react';
import GenreIndexPage from '../../../views/GenreIndexPage';
import { PublicZoneLayout } from '../../../components/Layouts';
import { Seo } from '../../../components';

/**
 * Genre hub: /libros/genero. It lists every genre landing and gives them a
 * single internal entry point (linked from the home's TopGenres block).
 *
 * Static by design — the genre list is a constant — so there is no
 * getServerSideProps: Next pre-renders it at build time and every visitor gets
 * the same HTML. It sits next to [slug].tsx without conflict: an exact `index`
 * match always wins over the dynamic segment.
 */
const GenreIndex: React.FC = () => (
  <>
    <Seo
      title="Géneros de libros para reseñar | Reseñan Sancho"
      description="Elige tu próxima lectura por género: fantasía, romántica, terror, novela negra y más. Encuentra libros para reseñar en tu blog o redes y pide tu ejemplar."
      // Self-canonical and indexable. It is NOT canonicalised to /books: this
      // hub is its own content (the genre index), not a variant of the listing.
      path="/libros/genero"
    />
    <PublicZoneLayout showFooter>
      <GenreIndexPage />
    </PublicZoneLayout>
  </>
);

export default GenreIndex;
