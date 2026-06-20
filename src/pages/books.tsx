import React from 'react';
import { useRouter } from 'next/router';
import BooksPage from '../views/BooksPage';
import BookDetailPage from '../views/BookDetailPage';
import { PublicZoneLayout } from '../components/Layouts';
import { Seo } from '../components';

const Books: React.FC = (): JSX.Element => {
  const { query: { book } } = useRouter();
  return (
    <>
      {book ? (
        // TODO: derive title/description/JSON-LD from real book data once the
        // detail page is server-rendered (phase S3). For now a generic fallback.
        <Seo
          title="Ficha de libro | Reseñan Sancho"
          description="Descubre los detalles de este libro disponible para reseñar en Reseñan Sancho: género, formato y cómo contactar con el autor."
          path="/books"
        />
      ) : (
        <Seo
          title="Libros para reseñar | Reseñan Sancho"
          description="Encuentra libros gratis para reseñar en tu blog, booktube o bookstagram. Filtra por género y formato y elige tu próxima lectura en Reseñan Sancho."
          path="/books"
        />
      )}
      <PublicZoneLayout>
        {
          book ? <BookDetailPage id={book as string} /> : <BooksPage />
        }
      </PublicZoneLayout>
    </>
  );
};


export default Books;
