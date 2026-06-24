import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

import { useFetchBook } from '../../utils/customHooks';
import UserContext from '../../store/context/userContext/UserContext';
import { ModalContact } from '../../components';
import { Book } from '../../interfaces/books';
import BookDetailHero from './BookDetailHero';
import BookDetailSynopsis from './BookDetailSynopsis';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetailPageProps {
  book: Book;
}

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

const BreadcrumbLink = styled(Link)`
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

// ─── Component ───────────────────────────────────────────────────────────────

const BookDetailPage: React.FC<BookDetailPageProps> = ({ book }) => {
  const { isLogged } = useContext(UserContext);
  // The book is provided by SSR for the first paint. useFetchBook only drives
  // the client-side refetch after an order, so its reducer state stays empty
  // until then; we fall back to the SSR `book` while that is the case.
  const [refetchedBook, fetchBook] = useFetchBook();
  const currentBook: Book = refetchedBook._id ? refetchedBook : book;

  const [openModalContact, setOpenModalContact] = useState(false);
  // Tracks how many copies have been ordered so we can refetch after a
  // successful order and show the updated copy count.
  const [copiesDecrease, setCopiesDecrease] = useState<number>(0);
  // Skip the mount run: SSR already provided the book, so we only refetch once
  // the user actually orders a copy (copiesDecrease turns truthy).
  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    fetchBook(book._id);
    // Refetch must fire only on a new order, not when fetchBook/book identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copiesDecrease]);

  return (
    <Wrapper>
      {/* Breadcrumb */}
      <BreadcrumbBar aria-label="Migas de pan">
        <BreadcrumbLink href="/books">← Volver a libros</BreadcrumbLink>
      </BreadcrumbBar>

      <BookDetailHero
        book={currentBook}
        isLoggedIn={isLogged}
        onRequest={() => setOpenModalContact(true)}
      />

      <BookDetailSynopsis synopsis={currentBook.synopsis} />

      <ModalContact
        open={openModalContact}
        onClose={(copiesOrdered: number) => {
          setCopiesDecrease(copiesOrdered);
          setOpenModalContact(false);
        }}
        book={currentBook._id}
        bookTitle={currentBook.title}
      />
    </Wrapper>
  );
};

export default BookDetailPage;
