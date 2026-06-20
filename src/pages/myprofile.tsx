import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const MyProfile = (): null => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=profile');
  }, []);
  return null;
};

export default MyProfile;
