import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { PublicZoneLayout } from '../components/Layouts';
import HeroSection from '../components/HeroSection';
import {
  AboutPlatform,
  FeaturedBooks,
  TopGenres,
  FeaturedBook,
  TopGenre,
} from '../components/HomeHighlights';
import { Seo } from '../components';
import { serializeJsonLd } from '../utils/seo/jsonLd';
import { buildWebsiteJsonLd, buildOrganizationJsonLd } from '../utils/seo/homeSeo';
import { getHomeHighlights } from '../utils/seo/getHomeHighlights';
import { toFeaturedBook, toTopGenre, mapDefined } from '../utils/seo/homeHighlightsMappers';

// UserContext queda disponible si en el futuro el hero necesita saber si el
// usuario está autenticado (p.ej. para cambiar el CTA de "Registrarse").
// Por ahora el diseño A3 no lo requiere, así que no lo consumimos.

interface HomePageProps {
  featuredBooks: FeaturedBook[];
  topGenres: TopGenre[];
}

const HomePage: React.FC<HomePageProps> = ({ featuredBooks, topGenres }) => (
  <>
    <Seo
      title="Reseñas para tu libro autopublicado | Reseñan Sancho"
      description="¿Nadie reseña tu libro? En Reseñan Sancho publicas su ficha gratis y conectas con reseñadores que leen tu género. ¿Reseñas libros? Pide ejemplares gratis."
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
      {/* Backgrounds alternate cream/white down the page: hero (cream) →
          SocialProof (white) → AboutPlatform (cream) → FeaturedBooks (white) →
          TopGenres (cream). Two adjacent blocks of the same colour would merge
          into one visual section. */}
      <AboutPlatform />
      {/* Each block renders null when its list is empty (API blip or every
          entry filtered out), so the rest of the home always shows up. */}
      <FeaturedBooks books={featuredBooks} />
      <TopGenres genres={topGenres} />
    </PublicZoneLayout>
  </>
);

export const getServerSideProps: GetServerSideProps<HomePageProps> = async ({ res }) => {
  const highlights = await getHomeHighlights();

  if (highlights.ok) {
    // The backend already caches these blocks for 24h, so the data barely moves.
    // Production serves straight from Heroku with no CDN in front, so nothing
    // consumes this `s-maxage` today: it is here for the day one is added, and
    // mirrors the header shape of the genre landings with a longer window. The
    // backend cache is what actually shields the API from traffic spikes.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  } else {
    // The fetch failed. Unlike /libros/genero/[slug] — where the listing IS the
    // page, so a 503 keeps a transient blip from being cached as `noindex` —
    // here the blocks are accessory: the home still ships hero, navigation and
    // footer, and a 503 on the site root is a far more aggressive signal about
    // the availability of the whole domain. Hence 200 + `no-store`: the page
    // degrades, and the degraded response is never cached for everyone.
    res.setHeader('Cache-Control', 'no-store');
  }

  return {
    props: {
      // Genre codes are resolved to names/slugs here so the UI never sees them.
      featuredBooks: highlights.featuredBooks.map(toFeaturedBook),
      topGenres: mapDefined(highlights.topGenres, toTopGenre),
    },
  };
};

export default HomePage;
