import React, { useState } from 'react';
import styled from 'styled-components';

interface AmazonHelpProps {
  // Defaults to the literal id used today (a single Amazon row renders at a
  // time), but lets a caller pass a channel-derived id (e.g. `${channelKey}-help`)
  // to keep the DOM unique if this panel is ever reused for more than one row.
  helpId?: string;
}

// Help panel for the Amazon channel: explains how to find the public
// profile URL (the one that lists the person's reviews) instead of a
// product page or a private account page. Collapsed by default, toggled
// by the trigger button below.
const AmazonHelp: React.FC<AmazonHelpProps> = ({ helpId = 'amazon-help' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Wrapper>
      <Trigger
        type="button"
        aria-expanded={isOpen}
        aria-controls={helpId}
        onClick={() => setIsOpen((open) => !open)}
      >
        ¿Dónde encuentro este enlace?
        <Chevron aria-hidden="true" $open={isOpen}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Chevron>
      </Trigger>
      {/* No focusable elements live inside the panel, so hiding it visually
          and via aria-hidden is enough to satisfy "closed = out of tab
          order" while still allowing the height transition below (a native
          `hidden` attribute would snap instantly instead of animating). */}
      <Panel id={helpId} $open={isOpen} aria-hidden={!isOpen}>
        <PanelContent>
          <p>
            Necesitamos el enlace de tu <strong>perfil público de Amazon</strong>, el que
            enseña tus reseñas. No el de un libro ni el de tu cuenta.
          </p>
          <ol>
            <li>Entra en Amazon y busca una reseña que hayas escrito.</li>
            <li>Pulsa tu nombre, justo encima de la reseña: se abre tu perfil.</li>
            <li>Copia la dirección de esa página y pégala aquí.</li>
          </ol>
          <p>Lo sabrás porque la dirección contiene <code>/gp/profile/</code>.</p>
          <Note>
            ¿No ves tus reseñas en el perfil? En Amazon, revisa que esté marcado como
            público en tus ajustes de privacidad.
          </Note>
        </PanelContent>
      </Panel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.terracotta};
  background: transparent;
  border: none;
  padding: 4px 0;
  min-height: 44px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const Chevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
  transition: transform 0.15s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Animates on `grid-template-rows` (0fr -> 1fr) rather than `max-height`:
// it avoids guessing a fixed max-height for variable-length content and
// still collapses to zero height for the hidden/tabbable requirement.
const Panel = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.2s ease;
  overflow: hidden;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const PanelContent = styled.div`
  min-height: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 8px;
  padding: 14px 16px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.ink};

  p {
    margin: 0 0 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  ol {
    margin: 0 0 10px;
    padding-left: 20px;
  }

  code {
    background: #efe5c8;
    border-radius: 4px;
    padding: 1px 5px;
  }
`;

const Note = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.brown};
`;

export default AmazonHelp;
