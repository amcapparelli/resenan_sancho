import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import { trackingId } from '../utils/constants/GATrackingID';
import { BooksList, BookItem } from '../components';
import { PublicZoneLayout } from '../components/Layouts';

const Books: React.FC = (): JSX.Element => {
  const { query: { book } } = useRouter();
  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.pageview('/books');
  }, []);
  return (
    <>
      <PublicZoneLayout>
        {
          book ? <BookItem id={book} /> : <BooksList />
        }
      </PublicZoneLayout>
    </>
  );
};


export default Books;
