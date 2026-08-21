import React from 'react';
import styled from 'styled-components';
import { BookmarkIcon } from './icons';

/**
 * Friendly reminder shown above the message field. Its content is fixed by the
 * spec (no props): it exists to cut down requests with no real intention to
 * review, so the wording is deliberate and not caller-configurable.
 */
const TipsBox: React.FC = () => (
  <Box>
    <IconSlot>
      <BookmarkIcon />
    </IconSlot>
    <Tips>
      <p>
        Antes de pedirlo, asegúrate de que este libro te llama de verdad — así la
        reseña te saldrá sola. Aprovecha el mensaje para presentarte y contar en
        qué blog o canal la vas a publicar: le da mucha tranquilidad a quien te
        lo envía.
      </p>
      <p>
        Y si al final no puedes escribirla, dile el motivo. Te lo van a agradecer
        mucho más que el silencio, y dejas la puerta abierta para la próxima vez.
      </p>
    </Tips>
  </Box>
);

const Box = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
  padding: 16px 16px 16px 14px;
  background: ${({ theme }) => theme.cream};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
`;

const IconSlot = styled.div`
  flex-shrink: 0;
  display: flex;
  color: ${({ theme }) => theme.terracotta};
`;

const Tips = styled.div`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.brown};

  p {
    margin: 0;
  }

  p + p {
    margin-top: 10px;
  }
`;

export default TipsBox;
