import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks, keeping the optional `book` edit param.
const AddBook = (): null => {
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
  return null;
};

export default AddBook;
