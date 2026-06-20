import React from 'react';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetailCTAProps {
  isLoggedIn: boolean;
  copies: number;
  onRequest: () => void;
}

// ─── Shared reduced-motion guard ─────────────────────────────────────────────

const reducedMotion = css`
  @media (prefers-reduced-motion: reduce) {
    transform: none;
    transition: none;
  }
`;

// ─── Styled ──────────────────────────────────────────────────────────────────

const Section = styled.section`
  padding: 16px 18px;
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const UnauthText = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  color: ${({ theme }) => theme.ink};
  line-height: 1.5;
  margin: 0;
`;

const UnauthRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

// Used as an anchor so next/link can pass the href down
const PrimaryButtonAnchor = styled.a`
  background: ${({ theme }) => theme.terracotta};
  color: ${({ theme }) => theme.white};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 22px;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  min-height: 44px;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: #a84a1b;
  }
`;

const LoginLink = styled.a`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.terracotta};
  text-decoration: underline;
  cursor: pointer;
`;

const AvailabilityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const GreenDot = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.exito};
  line-height: 1;
`;

const AvailabilityText = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
`;

const RequestButton = styled.button`
  background: ${({ theme }) => theme.amber};
  color: ${({ theme }) => theme.ink};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 13px 22px;
  border: none;
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #d9a304;
  }

  &:active {
    transform: scale(0.98);
  }

  ${reducedMotion}
`;

// ─── Component ───────────────────────────────────────────────────────────────

const BookDetailCTA: React.FC<BookDetailCTAProps> = ({
  isLoggedIn,
  copies,
  onRequest,
}) => {
  const router = useRouter();
  return (
    <Section aria-label="Pedir ejemplar">
      {isLoggedIn ? (
        <>
          <AvailabilityRow>
            <GreenDot aria-hidden="true">●</GreenDot>
            <AvailabilityText>{copies} ejemplares disponibles</AvailabilityText>
          </AvailabilityRow>

          <RequestButton onClick={onRequest}>
            Pedir un ejemplar →
          </RequestButton>
        </>
      ) : (
        <>
          <UnauthText>
            Para pedir un ejemplar necesitas una cuenta gratuita.
          </UnauthText>

          <UnauthRow>
            {/* Next.js 9 requires a child <a> inside Link */}
            <Link href="/register" passHref>
              <PrimaryButtonAnchor>Crear cuenta gratis →</PrimaryButtonAnchor>
            </Link>

            <Link href={{ pathname: '/login', query: { previous: router.asPath } }} passHref>
              <LoginLink>Inicia sesión</LoginLink>
            </Link>
          </UnauthRow>
        </>
      )}
    </Section>
  )
};

export default BookDetailCTA;
