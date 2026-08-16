import React from 'react';
import styled from 'styled-components';

import SectionHeading from './SectionHeading';

/**
 * "Qué es Reseñan Sancho": the only static block of the home body (the other
 * two are fed by SSR). It gives the page the substantial, indexable copy it was
 * missing and points authors at the promotion services.
 *
 * It reuses `SectionHeading` instead of its own <h2> so the three blocks share
 * one heading style; the spec's ~22px is close enough to the shared 24px that
 * diverging would only add a second heading scale to the home.
 */
const AboutPlatform = (): JSX.Element => (
  <Section>
    <SectionHeading>¿Qué es Reseñan Sancho?</SectionHeading>

    <Body>
      <Lead>
        Reseñan Sancho conecta a personas que escriben con personas que reseñan.
        Cada libro encuentra a quien puede leerlo con criterio, y cada reseñador
        encuentra libros que encajan con lo que le gusta leer.
      </Lead>
      {/* Brown, per spec: it separates the product/services message from the
          descriptive one above without introducing a second heading. */}
      <Services>
        Además, ofrecemos servicios pensados para dar más visibilidad a tu
        libro que ayudan a que más reseñadores lo descubran.
      </Services>
    </Body>
  </Section>
);

const Section = styled.section`
  background-color: ${({ theme }) => theme.cream};
  padding: 40px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 480px) {
    padding: 56px 28px;
  }
`;

/* Narrower than the section so the lines stay readable on desktop. */
const Body = styled.div`
  max-width: 520px;
  margin: 0 auto;
  text-align: center;
`;

const Paragraph = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  line-height: 1.65;
  margin: 0;
`;

const Lead = styled(Paragraph)`
  color: ${({ theme }) => theme.ink};
`;

const Services = styled(Paragraph)`
  color: ${({ theme }) => theme.brown};
  margin-top: 14px;
`;

export default AboutPlatform;
