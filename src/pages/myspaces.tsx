import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const MySpaces = (): null => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=spaces');
  }, []);
  return null;
};

export default MySpaces;
