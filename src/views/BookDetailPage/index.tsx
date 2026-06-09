import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { useFetchBook } from '../../utils/customHooks';
import UserContext from '../../store/context/userContext/UserContext';
import { ModalContact } from '../../components';
import BookDetailHero from './BookDetailHero';
import BookDetailSynopsis from './BookDetailSynopsis';
import BookDetailSkeleton from './BookDetailSkeleton';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetailPageProps {
  id: string;
}

// ─── Error state icon ─────────────────────────────────────────────────────────

const ErrorBookIcon: React.FC = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

// ─── Styled ──────────────────────────────────────────────────────────────────

const Wrapper = styled.div`
  background: ${({ theme }) => theme.white};
  min-height: 100vh;
`;

// ─── Breadcrumb ────────────────────────────────────────────────────────────

const BreadcrumbBar = styled.nav`
  padding: 12px 20px;
  background: ${({ theme }) => theme.white};
  border-bottom: 0.5px solid ${({ theme }) => theme.lightBorder};

  @media (min-width: 600px) {
    padding: 14px 28px;
  }
`;

const BreadcrumbLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.brown};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.terracotta};
  }
`;

// ─── Error state ──────────────────────────────────────────────────────────────

const ErrorContainer = styled.div`
  padding: 80px 28px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ErrorIconWrapper = styled.div`
  color: ${({ theme }) => theme.terracotta};
  opacity: 0.4;
`;

const ErrorTitle = styled.h1`
  font-family: 'Fraunces', serif;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.ink};
  margin: 0;
`;

const ErrorSubtitle = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 15px;
  color: ${({ theme }) => theme.brown};
  margin: 0;
`;

const ErrorButton = styled.a`
  background: ${({ theme }) => theme.terracotta};
  color: ${({ theme }) => theme.white};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px 22px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: #a84a1b;
  }
`;

// ─── Component ───────────────────────────────────────────────────────────────

const BookDetailPage: React.FC<BookDetailPageProps> = ({ id }) => {
  const { isLogged } = useContext(UserContext);
  const [state, fetchBook, loading] = useFetchBook();

  const [openModalContact, setOpenModalContact] = useState(false);
  // Tracks how many copies have been ordered so we can refetch
  // after a successful order and show the updated copy count.
  const [copiesDecrease, setCopiesDecrease] = useState<number>(0);

  useEffect(() => {
    fetchBook(id);
    // copiesDecrease is intentionally included: when the user orders
    // a copy the modal sets it to 1, triggering a fresh fetch to reflect
    // the decremented count from the API.
  }, [id, copiesDecrease]);

  if (loading) {
    return (
      <Wrapper>
        <BookDetailSkeleton />
      </Wrapper>
    );
  }

  if (!state._id) {
    return (
      <Wrapper>
        <ErrorContainer>
          <ErrorIconWrapper>
            <ErrorBookIcon />
          </ErrorIconWrapper>
          <ErrorTitle>Este libro no está disponible</ErrorTitle>
          <ErrorSubtitle>
            Es posible que se haya eliminado o que el enlace no sea correcto.
          </ErrorSubtitle>
          {/* Next.js 9 requires a child <a> inside Link */}
          <Link href="/books" passHref>
            <ErrorButton>← Explorar libros</ErrorButton>
          </Link>
        </ErrorContainer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {/* Breadcrumb */}
      <BreadcrumbBar aria-label="Migas de pan">
        <Link href="/books" passHref>
          <BreadcrumbLink>← Volver a libros</BreadcrumbLink>
        </Link>
      </BreadcrumbBar>

      <BookDetailHero
        book={state}
        isLoggedIn={isLogged}
        onRequest={() => setOpenModalContact(true)}
      />

      <BookDetailSynopsis synopsis={state.synopsis} />

      <ModalContact
        open={openModalContact}
        onClose={(copiesOrdered: number) => {
          setCopiesDecrease(copiesOrdered);
          setOpenModalContact(false);
        }}
        book={state._id}
        bookTitle={state.title}
      />
    </Wrapper>
  );
};

export default BookDetailPage;
