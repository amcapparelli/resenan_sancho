import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.header`
  background: ${({ theme }) => theme.cream};
  padding: 36px 28px 32px;
  text-align: center;
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (max-width: 480px) {
    padding: 24px 20px 20px;
  }
`;

const Eyebrow = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.brown};
  margin: 0 0 10px;
`;

const Title = styled.h1`
  font-family: 'Fraunces', serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 1.15;
  color: ${({ theme }) => theme.ink};
  margin: 0 0 10px;

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const TitleAccent = styled.em`
  font-style: normal;
  color: ${({ theme }) => theme.terracotta};
`;

const Subtitle = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: ${({ theme }) => theme.brown};
  max-width: 460px;
  margin: 0 auto;
`;

const PageHeader: React.FC = () => (
  <Wrapper>
    <Eyebrow>LIBROS EN BÚSQUEDA DE RESEÑAS</Eyebrow>
    <Title>
      Encuentra tu próxima <TitleAccent>lectura</TitleAccent>
    </Title>
    <Subtitle>
      Pide el ejemplar que te interese. El autor recibe tu mensaje y te lo envía.
    </Subtitle>
  </Wrapper>
);

export default PageHeader;
