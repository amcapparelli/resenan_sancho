import React from 'react';
import Head from 'next/head';
import { PublicZoneLayout } from '../components/Layouts';
import HeroSection from '../components/HeroSection';
import { Seo } from '../components';
import { serializeJsonLd } from '../utils/seo/jsonLd';
import { buildWebsiteJsonLd, buildOrganizationJsonLd } from '../utils/seo/homeSeo';

// UserContext queda disponible si en el futuro el hero necesita saber si el
// usuario está autenticado (p.ej. para cambiar el CTA de "Registrarse").
// Por ahora el diseño A3 no lo requiere, así que no lo consumimos.

const HomePage: React.FC = () => (
  <>
    <Seo
      title="Reseñan Sancho — Conecta escritores con reseñadores literarios"
      description="El buscador doble para el mundo del libro: escritores encuentran reseñadores y los reseñadores libros gratis para reseñar en su blog, booktube o bookstagram. Filtra por género y formato."
      path="/"
    />
    <Head>
      {/* Server-rendered structured data so crawlers get it without JS. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebsiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildOrganizationJsonLd()) }}
      />
    </Head>
    <PublicZoneLayout showFooter>
      <HeroSection />
    </PublicZoneLayout>
  </>
);

export default HomePage;
