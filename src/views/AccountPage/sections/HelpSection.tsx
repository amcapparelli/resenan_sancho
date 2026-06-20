import React, { useId, useState } from 'react';
import styled from 'styled-components';
import SectionHeader from '../SectionHeader';

const SUPPORT_EMAIL = 'alejandro@resenansancho.com';

const Chevron: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

interface AccordionItemProps {
  question: string;
  children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, children }) => {
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const headerId = `${baseId}-header`;
  const bodyId = `${baseId}-body`;

  return (
    <Item>
      <Header
        id={headerId}
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Question>{question}</Question>
        <ChevronHolder $open={open}><Chevron /></ChevronHolder>
      </Header>
      {open && (
        <Body id={bodyId} role="region" aria-labelledby={headerId}>
          {children}
        </Body>
      )}
    </Item>
  );
};

const HelpSection: React.FC = (): JSX.Element => (
  <>
    <SectionHeader title="Ayuda" subtitle="Respuestas a las preguntas más habituales." />

    <AccordionItem question="Mi libro no aparece en el listado de libros disponibles">
      Para que un libro aparezca en el listado, primero debes darlo de alta en
      «Añade libro». Luego, en «Mis libros», puedes administrar tus ejemplares: un
      libro solo aparece en el listado cuando tiene ejemplares disponibles. Para
      añadirlos, usa la opción «Promocionar».
    </AccordionItem>

    <AccordionItem question="Mi perfil de reseñador aparece muy atrás en los resultados">
      ¡No te preocupes, hay solución! Si te registraste hace tiempo como reseñador,
      es posible que aparezcas atrás en los resultados. Si quieres aparecer en los
      primeros lugares, escríbenos a <EmailLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</EmailLink>
      {' '}y te subimos.
    </AccordionItem>

    <AccordionItem question="¿Tienes una duda, un comentario o algo no funciona como esperabas?">
      No dudes en escribirnos a <EmailLink href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</EmailLink>.
    </AccordionItem>
  </>
);

const Item = styled.div`
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.white};
`;

const Header = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 14px 16px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.terracotta};
    outline-offset: -2px;
    border-radius: 10px;
  }
`;

const Question = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
`;

const ChevronHolder = styled.span<{ $open: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ theme }) => theme.brown};
  transition: transform 0.2s ease;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Body = styled.div`
  padding: 0 16px 16px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: #5a524a;
`;

const EmailLink = styled.a`
  color: ${({ theme }) => theme.terracotta};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default HelpSection;
