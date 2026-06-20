import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Seo } from '../components';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const MyBooks = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=books');
  }, []);
  return (
    <Seo noindex title="Mis libros | Reseñan Sancho" description="Área personal de Reseñan Sancho." path="/mybooks" />
  );
};

export default MyBooks;
