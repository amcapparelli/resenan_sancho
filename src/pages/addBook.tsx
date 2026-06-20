import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Seo } from '../components';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks, keeping the optional `book` edit param.
const AddBook = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    const { book } = router.query;
    router.replace(
      book
        ? `/account?section=addBook&book=${book}`
        : '/account?section=addBook',
    );
  }, [router.isReady]);
  return (
    <Seo noindex title="Añade libro | Reseñan Sancho" description="Área personal de Reseñan Sancho." path="/addBook" />
  );
};

export default AddBook;
