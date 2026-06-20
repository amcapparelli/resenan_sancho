import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const Help = (): null => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=help');
  }, []);
  return null;
};

export default Help;
