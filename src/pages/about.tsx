import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import styledComponents from 'styled-components';
import { PublicZoneLayout } from '../components/Layouts';

const about = () => (
  <PublicZoneLayout showFooter>
    <Card>
      <CardContent>
        <Typography variant="h2" align="center">¿Qué es Reseñan Sancho?</Typography>
        <StyledParagraph>
          Reseñan Sancho es una herramienta que pone en contacto a escritores independientes
          y editoriales con lectores que reseñan libros.
          Nuestro objetivo es facilitar la publicación de reseñas literarias en blogs,
          canales de Youtube en Goodreads, de libros de ficción recientemente lanzados
          o próximos a hacerlo.
          Para ello buscamos categorizar nuestro directorio de blogs, canales de youtube y perfiles
          de Goodreads, para poder encontrar más fácilmente a los reseñadores adecuados para cada
          novela. Reseñan Sancho fue creada también para apoyar el trabajo de los blogs literarios
          y canales de youtube que reseñan libros. Creemos que su trabajo es un aporte de inmenso
          valor no sólo para el mercado editorial, sino para miles de personas que buscan su próxima
          lectura.
        </StyledParagraph>
        <Typography variant="h3" align="center">Preguntas frecuentes:</Typography>
        <Typography variant="h4" align="center">¿Hay que pagar?</Typography>
        <StyledParagraph>
          No. Los autores pueden utilizar todos los recursos de la plataforma sin pagar.
          Pueden consultar el directorio de blogs literarios, así como publicar la
          información de su novela para ser contactados por los reseñadores, todo de
          manera gratuita.
          Si un reseñador te pide un ejemplar para reseñarlo tampoco tienes que pagar.
          Los reseñadores no cobran por ello. Nosotros tampoco cobramos por facilitar
          el contacto entre reseñadores y autores.
          Si eres reseñador literario no tienes que pagar nada por registrar tu blog o
          canal de youtube en nuestro directorio.
        </StyledParagraph>
        <Typography variant="h4" align="center">¿Hay servicios de pago?</Typography>
        <StyledParagraph>
          Si, los hay. Son opcionales.
          Con los servicios de pago ayudamos a los autores
          a conseguir mejores resultados, es decir, más reseñas y más rápido.
        </StyledParagraph>
        <Typography variant="h4" align="center">¿Los servicios de pago son para cualquier libro?</Typography>
        <StyledParagraph>
          Para la mayoría sí. Siempre que aceptamos el encargo de promocionar un libro es porque
          lo hemos leído primero para asegurarnos de que estamos proponiendo a los reseñadores
          la lectura de una novela que está bien terminada (corregida, editada, etc.).
        </StyledParagraph>
        <Typography variant="h4" align="center">Mi blog aparece muy abajo en los resultados de búsqueda, ¿qué puedo hacer?</Typography>
        <StyledParagraph>
          Fácil! Si estás con ganas de que tu blog aparezca antes en los resultados de búsqueda,
          utiliza Twitter para hacérnoslo saber (@resenansancho). Ten en cuenta que si apareces
          de los primeros recibirás más propuestas de lectura, por lo que si tienes muchos libros
          pendientes de leer, quizás mejor esperar al momento adecuado.
        </StyledParagraph>
        <Typography variant="h4" align="center">¿Qué ventajas tiene registrar mi blog?</Typography>
        <StyledParagraph>
          Varias. Por ejemplo, recibirás más propuestas de lectura de autores y editoriales que
          te encuentren en nuestra plataforma. Además, como habrás seleccionado los géneros
          literarios que te interesan, recibirás propuestas más acordes a tus intereses de lectura.
          Además nosotros también te propondremos lecturas. Generalmente las propuestas de
          lectura que te haremos vendrán acompañas de concursos y premios económicos a las mejores
          reseñas. Esto solo es para reseñadores registrados.
        </StyledParagraph>
        <Typography variant="h4" align="center">¿Qué pasa si un libro que me proponéis no me gusta y publico una reseña negativa?</Typography>
        <StyledParagraph>
          ¡Absolutamente nada! Nuestro objetivo es no influir jamás en tu criterio.
          Tu honestidad para escribir las reseñas es lo más importante y jamás vamos a
          pedirte que cambies ni una coma.
        </StyledParagraph>
        <Typography variant="h4" align="center">¿Qué pasa si al final no publico la reseña sobre el libro que me envía el autor o vosotros?</Typography>
        <StyledParagraph>
          Tampoco pasa nada, son cosas que pueden suceder. Aunque ten en cuenta que
          siempre que alguien te envía un libro se generan expectativas, por lo que no está de
          más enviar un email explicando los motivos por los que finalmente la reseña no saldrá
          publicada.
        </StyledParagraph>
        <StyledParagraph>
          ¡Si te queda alguna duda, por favor
          <a href="mailto:alejandro@resenansancho.com">
            contacta
          </a>
          !
        </StyledParagraph>
      </CardContent>
    </Card>
  </PublicZoneLayout>
);

const StyledParagraph = styledComponents.p`
  margin-top: 1rem;
  margin-bottom: 3rem;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1rem;
  width: 70%;
  margin-left: 15%;
  line-height : 2rem;
`;

export default about;
