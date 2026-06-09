import React from 'react';
import { useRouter } from 'next/router';
import { BookItem } from '../components';
import BooksPage from '../views/BooksPage';
import { PublicZoneLayout } from '../components/Layouts';

const Books: React.FC = (): JSX.Element => {
  const { query: { book } } = useRouter();
  return (
    <>
      <PublicZoneLayout>
        {
          book ? <BookItem id={book} /> : <BooksPage />
        }
      </PublicZoneLayout>
    </>
  );
};


export default Books;
