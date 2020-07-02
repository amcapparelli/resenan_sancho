import React from 'react';
import styledComponents from 'styled-components';
import { Typography, Link } from '@material-ui/core';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import MailIcon from '@material-ui/icons/Mail';

const Footer = () => (
  <StyledFooter>
    <StyledLegal>
      <Typography variant="h6">Avisos Legales</Typography>
      <Link href="/about">
        <Typography component="p" color="secondary">¿Qué es Reseñan Sancho? Preguntas frecuentes.</Typography>
      </Link>
      <Link href="/legal">
        <Typography component="p" color="secondary">Aviso legal y Política de Privacidad.</Typography>
      </Link>
    </StyledLegal>
    <StyledSocial>
      <Link href="https://www.instagram.com/resenansancho/">
        <InstagramIcon />
      </Link>
      <Link href="https://twitter.com/ResenanSancho">
        <TwitterIcon />
      </Link>
      <Link href="https://www.facebook.com/resenansancho/">
        <FacebookIcon />
      </Link>
      <Link href="mailto:alejandro@resenansancho.com">
        <MailIcon />
      </Link>
    </StyledSocial>
  </StyledFooter>
);

const StyledLegal = styledComponents.footer`
  float: left;
`;

const StyledSocial = styledComponents.footer`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
  margin-right: 5%;
  float: right;
`;

const StyledFooter = styledComponents.footer`
  margin-top: 3rem;
  margin-bottom: 0;
  padding: 2%;
  margin-left: calc(50% - 50vw);
  width: 100vw;
  height: 8rem;
  color: #f6f6f6;
  background-color: #080807;
  text-align: left;
`;

export default Footer;
