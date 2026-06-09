import React from 'react';
import { useRouter } from 'next/router';
import BooksPage from '../views/BooksPage';
import BookDetailPage from '../views/BookDetailPage';
import { PublicZoneLayout } from '../components/Layouts';

const Books: React.FC = (): JSX.Element => {
  const { query: { book } } = useRouter();
  return (
    <>
      <PublicZoneLayout>
        {
          book ? <BookDetailPage id={book as string} /> : <BooksPage />
        }
      </PublicZoneLayout>
    </>
  );
};


export default Books;
