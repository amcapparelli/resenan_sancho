import React, { useContext } from 'react';
import styledComponents from 'styled-components';
import Link from 'next/link';
import { PublicZoneLayout } from '../components/Layouts';
import { StyledTitle } from '../components';
import UserContext from '../store/context/userContext/UserContext';

const index = () => {
  const { isLogged } = useContext(UserContext);
  return (
    <div>
      <PublicZoneLayout showFooter>
        <StyledTitle
          text="Un libro sin reseñas es un libro aún sin publicar."
        />
        <StyledSection>
          <StyledArticleContainer>
            <StyledArticleTitle>
              <h2>
                Reseñan Sancho es un sitio para conectar a escritores con reseñadores literarios.
              </h2>
            </StyledArticleTitle>
            <StyledArticleP>
              <p>
                Sabemos que una reseña literaria puede ser positiva o negativa,
                pero lo importante es que sea honesta.
              </p>
              <p>
                No solo para dar a conocer nuestra novela sino para mejorar como escritores,
                las reseñas son una parte muy importante del proceso editorial.
              </p>
              <p>
                Por eso, Reseñan Sancho toma su nombre de la célebre frase:
                «Ladran, Sancho, señal que cabalgamos».
              </p>
            </StyledArticleP>
            <StyledNav>
              <Link href="/reviewers">
                <StyledArticleButton>Encontrar reseñadores</StyledArticleButton>
              </Link>
              <Link href="/books">
                <StyledArticleButton>Encontrar Libros</StyledArticleButton>
              </Link>
            </StyledNav>
          </StyledArticleContainer>
        </StyledSection>
        <StyledSectionB>
          <StyledArticleBContainer>
            <StyledArticleTitleB>
              <h2>
                Libros para Reseñadores Literarios.
              </h2>
            </StyledArticleTitleB>
            <StyledArticleBP>
              <p>
                Si tienes un blog literario, eres booktuber o bookstagramer,
                o simplemente te encanta escribir reseñas de los libros que lees, en goodreads
                o amazon, sabemos que siempre tendrás interés en descubrir a una escritora o
                escritor nuevos.
              </p>
              <p>
                Crea tu cuenta para encotrar libros y conectar con sus autores.
                Ellos te lo agradecerán y estarán dispuestos a enviarte un ejemplar de su novela.
              </p>
              <p>
                Además, participarás en
                <b> concursos de reseñas</b>
                , propuestas de lecturas conjuntas
                y lanzamientos de libros en tu país.
              </p>
            </StyledArticleBP>
            <StyledNav>
              <Link href="/books">
                <StyledArticleButton>Ver Libros Disponibles</StyledArticleButton>
              </Link>
              {
                !isLogged
                  ? (
                    <Link href="/register">
                      <StyledArticleButton>Darme de alta</StyledArticleButton>
                    </Link>
                  )
                  : (
                    <Link href="/myspaces">
                      <StyledArticleButton>Añadir Mi espacio literario</StyledArticleButton>
                    </Link>
                  )
              }
            </StyledNav>
          </StyledArticleBContainer>
        </StyledSectionB>
        <StyledSection>
          <StyledArticleContainer>
            <StyledArticleTitleB>
              <h2>
                Promoción para escritores.
              </h2>
            </StyledArticleTitleB>
            <StyledArticleP>
              <p>
                La mejor forma de promocionar una novela es que los demás hablen de ella.
              </p>
              <p>
                Una reseña literaria es un lector recomendándole a otros lectores un libro.
              </p>
              <p>
                Si quieres empezar a dar a conocer tu obra, crea tu cuenta y empieza a ofrecer tu
                libro a cientos de reseñadores liteararios interesados en el género de tu novela.
              </p>
            </StyledArticleP>
            <StyledNav>
              <Link href="/reviewers">
                <StyledArticleButton>Encontrar reseñadores</StyledArticleButton>
              </Link>
              {
                !isLogged
                  ? (
                    <Link href="/register">
                      <StyledArticleButton>Darme de alta</StyledArticleButton>
                    </Link>
                  )
                  : (
                    <Link href="/addBook">
                      <StyledArticleButton>Añadir Libro</StyledArticleButton>
                    </Link>
                  )
              }

            </StyledNav>
          </StyledArticleContainer>
        </StyledSection>
      </PublicZoneLayout>
    </div>
  );
};

const StyledSectionB = styledComponents.section`
  margin-left: calc(50% - 50vw);
  width: 100vw;
`;

const StyledSection = styledComponents.section`
  margin-top: 5%;
  margin-left: calc(50% - 50vw);
  width: 100vw;
  background-color: #f5f5f0;
`;

const StyledArticleTitle = styledComponents.h2`
  font-family: ${(props) => props.theme.fontFamily};
  color: ${(props) => props.theme.contrastText};
  font-size: 1.5rem;
  grid-area: head;
  margin-bottom: 0;
`;

const StyledArticleTitleB = styledComponents.h2`
  font-family: ${(props) => props.theme.fontFamily};
  color: ${(props) => props.theme.contrastText};
  font-size: 2rem;
  grid-area: head;
  margin-bottom: 0;
`;

const StyledArticleP = styledComponents.p`
  margin-top: 0;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  grid-area: main;
`;

const StyledArticleBP = styledComponents.p`
  margin-top: 0;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  grid-area: main;
`;

const StyledNav = styledComponents.div`
  grid-area: nav;
  justify-self: center;
  align-self: center;
`;

const StyledArticleButton = styledComponents.button`
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  width: 100%;
  margin: 5%;
  padding: 5%;
  color: ${(props) => props.theme.dark};
  background-color: ${(props) => props.theme.main};
  border-radius: 25px;
  :hover{
    cursor: pointer;
    background-color: ${(props) => props.theme.dark};
    color: ${(props) => props.theme.main};
  }
`;

const StyledArticleContainer = styledComponents.article`
  padding: 0 5% 0 5%;
  display: grid;
  grid-template-areas: "head nav"
                       "main nav";
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;           
`;

const StyledArticleBContainer = styledComponents.article`
  padding: 0 5% 0 5%;
  display: grid;
  grid-template-areas: "nav head"
                       "nav main";
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr;           
`;
export default index;
