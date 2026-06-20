import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Seo } from '../components';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const MySpaces = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=spaces');
  }, []);
  return (
    <Seo noindex title="Mis espacios literarios | Reseñan Sancho" description="Área personal de Reseñan Sancho." path="/myspaces" />
  );
};

export default MySpaces;
