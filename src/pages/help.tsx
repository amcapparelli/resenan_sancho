import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Seo } from '../components';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const Help = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=help');
  }, []);
  return (
    <Seo noindex title="Ayuda | Reseñan Sancho" description="Área personal de Reseñan Sancho." path="/help" />
  );
};

export default Help;
