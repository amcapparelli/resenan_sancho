import React from 'react';
import { PublicZoneLayout } from '../components/Layouts';
import HeroSection from '../components/HeroSection';

// UserContext queda disponible si en el futuro el hero necesita saber si el
// usuario está autenticado (p.ej. para cambiar el CTA de "Registrarse").
// Por ahora el diseño A3 no lo requiere, así que no lo consumimos.

const HomePage: React.FC = () => (
  <PublicZoneLayout showFooter>
    <HeroSection />
  </PublicZoneLayout>
);

export default HomePage;
