import React from 'react';
import { GetServerSideProps } from 'next';
import BooksPage from '../views/BooksPage';
import { PublicZoneLayout } from '../components/Layouts';
import { Seo } from '../components';

const Books: React.FC = (): JSX.Element => (
  <>
    <Seo
      title="Libros para reseñar | Reseñan Sancho"
      description="Encuentra libros gratis para reseñar en tu blog, booktube o bookstagram. Filtra por género y formato y elige tu próxima lectura en Reseñan Sancho."
      path="/books"
    />
    <PublicZoneLayout>
      <BooksPage />
    </PublicZoneLayout>
  </>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // Permanently redirect the legacy /books?book=<id> detail URL to the
  // dedicated server-rendered /books/<id> route (phase S3).
  if (query.book) {
    return {
      redirect: {
        destination: `/books/${query.book}`,
        permanent: true,
      },
    };
  }

  return { props: {} };
};

export default Books;
