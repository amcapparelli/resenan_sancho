import React from 'react';
import styledComponents from 'styled-components';
import packageJson from '../../package.json';

const version = packageJson.version;

const InstagramSvg = (): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterSvg = (): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#a89880" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const FacebookSvg = (): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#a89880" aria-hidden="true">
    <path d="M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.6H6.61v3.56h3.07V22h3.68v-9.14h3.06l.46-3.56h-3.52V7.05c0-1.03.28-1.73 1.76-1.73Z" />
  </svg>
);

const EmailSvg = (): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89880" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 6 10-6" />
  </svg>
);

const Footer = (): JSX.Element => (
  <StyledFooter>
    <FooterBody className="footer-body">
      <LegalColumn>
        <SectionLabel>AVISOS LEGALES</SectionLabel>
        <LegalLinks>
          <LegalLink href="/about">¿Qué es Reseñan Sancho? Preguntas frecuentes.</LegalLink>
          <LegalLink href="/legal">Aviso legal y Política de Privacidad.</LegalLink>
        </LegalLinks>
      </LegalColumn>

      <SocialColumn>
        <SectionLabel className="social-label">SÍGUENOS</SectionLabel>
        <SocialLinks>
          <SocialLink
            href="https://www.instagram.com/resenansancho/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reseñan Sancho en Instagram"
          >
            <span>Instagram</span>
            <SocialIcon className="social-icon"><InstagramSvg /></SocialIcon>
          </SocialLink>
          <SocialLink
            href="https://twitter.com/ResenanSancho"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reseñan Sancho en Twitter"
          >
            <span>Twitter / X</span>
            <SocialIcon className="social-icon"><TwitterSvg /></SocialIcon>
          </SocialLink>
          <SocialLink
            href="https://www.facebook.com/resenansancho/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reseñan Sancho en Facebook"
          >
            <span>Facebook</span>
            <SocialIcon className="social-icon"><FacebookSvg /></SocialIcon>
          </SocialLink>
          <SocialLink
            href="mailto:alejandro@resenansancho.com"
            aria-label="Escribir un email a Reseñan Sancho"
          >
            <span>Email</span>
            <SocialIcon className="social-icon"><EmailSvg /></SocialIcon>
          </SocialLink>
        </SocialLinks>
      </SocialColumn>
    </FooterBody>

    <BottomBar>
      <Logo>Reseñan Sancho</Logo>
      <Version aria-hidden="true">{`v${version}`}</Version>
    </BottomBar>
  </StyledFooter>
);

const StyledFooter = styledComponents.footer`
  display: grid;
  grid-template-rows: 1fr auto;
  background: ${({ theme }) => theme.ink};
  padding: 36px 28px 20px;
  margin-left: calc(50% - 50vw);
  width: 100vw;

  @media (max-width: 480px) {
    padding: 28px 20px 16px;
  }
`;

const FooterBody = styledComponents.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: start;
  padding-bottom: 24px;
  border-bottom: 0.5px solid rgba(212, 201, 176, 0.25);
  margin-bottom: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const SectionLabel = styledComponents.p`
  margin: 0 0 12px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a89880;
`;

const LegalColumn = styledComponents.div``;

const LegalLinks = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LegalLink = styledComponents.a`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.lightBorder};
  text-decoration: none;
  line-height: 1.45;
  display: block;

  &:hover {
    color: ${({ theme }) => theme.amber};
  }
`;

const SocialColumn = styledComponents.div`
  .social-label {
    text-align: right;
  }

  @media (max-width: 480px) {
    .social-label {
      text-align: left;
    }
  }
`;

const SocialLinks = styledComponents.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  @media (max-width: 480px) {
    align-items: flex-start;
  }
`;

const SocialLink = styledComponents.a`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: #a89880;
  text-decoration: none;
  justify-content: flex-end;

  &:hover {
    color: ${({ theme }) => theme.amber};
  }

  &:hover .social-icon {
    border-color: ${({ theme }) => theme.amber};
  }

  @media (max-width: 480px) {
    justify-content: flex-start;
  }
`;

const SocialIcon = styledComponents.span`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 0.5px solid rgba(212, 201, 176, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const BottomBar = styledComponents.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styledComponents.span`
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.brown};
`;

const Version = styledComponents.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  color: rgba(168, 152, 128, 0.6);
  font-variant-numeric: tabular-nums;
`;

export default Footer;
