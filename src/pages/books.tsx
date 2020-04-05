import React from 'react';
import { useRouter } from 'next/router';
import { BooksList, BookItem } from '../components';
import { PublicZoneLayout } from '../components/Layouts';

const Books: React.FC = (): JSX.Element => {
  const { query: { book } } = useRouter();
  return (
    <>
      <PublicZoneLayout />
      {
        book ? <BookItem id={book} /> : <BooksList />
      }
    </>
  );
};


export default Books;
