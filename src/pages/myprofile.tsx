import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Seo } from '../components';

// Legacy route — the account area is now a single page (/account).
// Redirect to preserve old links/bookmarks.
const MyProfile = (): JSX.Element => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/account?section=profile');
  }, []);
  return (
    <Seo noindex title="Mi perfil | Reseñan Sancho" description="Área personal de Reseñan Sancho." path="/myprofile" />
  );
};

export default MyProfile;
