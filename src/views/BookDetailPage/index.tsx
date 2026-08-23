/* eslint-disable no-underscore-dangle */
import React, {
  useContext, useEffect, useState,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ReactGA from 'react-ga4';

import { useFetchBook } from '../../utils/customHooks';
import UserContext from '../../store/context/userContext/UserContext';
import { ContactModal } from '../../components';
import { Book } from '../../interfaces/books';
import BookDetailHero from './BookDetailHero';
import BookDetailSynopsis from './BookDetailSynopsis';
import OrderSuccessToast from './OrderSuccessToast';
import useOrderBook from './useOrderBook';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BookDetailPageProps {
  book: Book;
}

// ─── Constants ───────────────────────────────────────────────────────────────

/** Long enough to read the confirmation, short enough not to sit on the page. */
const SUCCESS_TOAST_MS = 6000;

const DEFAULT_BACK_HREF = '/books';
const GENRE_FACET_PREFIX = '/libros/genero/';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Only trusts the `from` query param as a back-link target when it is a
 * relative, internal path pointing at the listing itself (`/books`, optionally
 * with a query string) or one of its genre facets. Matching is exact on segment
 * boundaries rather than a plain prefix check: `/books` alone would also match
 * `/books/[id]`, so an attacker-controlled `from` pointing at a *different*
 * book detail page would otherwise sneak past the whitelist and break the
 * "back to listing" semantics. This also rejects protocol-relative URLs
 * (`//evil.com`) and any other host, preventing an open redirect.
 */
const getSafeBackHref = (from: unknown): string => {
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) {
    return DEFAULT_BACK_HREF;
  }
  const isSafe = from === DEFAULT_BACK_HREF
    || from.startsWith(`${DEFAULT_BACK_HREF}?`)
    || from.startsWith(GENRE_FACET_PREFIX);
  return isSafe ? from : DEFAULT_BACK_HREF;
};

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
  const router = useRouter();
  const backHref = getSafeBackHref(router.query.from);
  const { isLogged, user } = useContext(UserContext);
  // The book is provided by SSR for the first paint. useFetchBook only drives
  // the client-side refetch after an order, so its reducer state stays empty
  // until then; we fall back to the SSR `book` while that is the case.
  const [refetchedBook, fetchBook] = useFetchBook();
  const currentBook: Book = refetchedBook._id ? refetchedBook : book;

  const orderBook = useOrderBook();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  // Counts successful orders so we can refetch the book and show the updated
  // copy count. A counter (not a boolean) so a second order refetches again.
  const [ordersPlaced, setOrdersPlaced] = useState(0);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Refetch the book to pick up the new copy count. Guarded on the counter and
  // not on a `didMount` ref: StrictMode runs setup → cleanup → setup, which a ref
  // set on the first setup can no longer tell apart from a real order, so it used
  // to fire a spurious fetch on mount in development.
  useEffect(() => {
    if (ordersPlaced === 0) return;
    fetchBook(book._id);
    // Refetch must fire only on a new order, not when fetchBook/book identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordersPlaced]);

  // Keyed on the order counter, not on the flag itself, so a second order within
  // the same visit restarts the countdown instead of inheriting the old timer.
  useEffect(() => {
    if (ordersPlaced === 0) return undefined;
    setShowSuccessToast(true);
    const timeoutId = setTimeout(() => setShowSuccessToast(false), SUCCESS_TOAST_MS);
    return () => clearTimeout(timeoutId);
  }, [ordersPlaced]);

  // The page owns the request: ContactModal is presentational and only needs the
  // promise to reject when the send fails, so it can show its error banner.
  const handleOrderSubmit = async (message: string) => {
    await orderBook(currentBook._id, message);

    setIsContactModalOpen(false);
    // Drives both the copies refetch and the success toast.
    setOrdersPlaced((count) => count + 1);

    // Last: analytics must never be able to turn a successful order into the
    // modal's error banner, which is what a throw before these setters would do.
    ReactGA.event({
      category: 'Ejemplar pedido',
      action: `Libro pedido: ${currentBook.title}, reseñador: ${user.name} ${user.lastName || ''}`,
    });
  };

  return (
    <Wrapper>
      {/* Breadcrumb */}
      <BreadcrumbBar aria-label="Migas de pan">
        <BreadcrumbLink href={backHref}>← Volver a libros</BreadcrumbLink>
      </BreadcrumbBar>

      <BookDetailHero
        book={currentBook}
        isLoggedIn={isLogged}
        onRequest={() => setIsContactModalOpen(true)}
      />

      <BookDetailSynopsis synopsis={currentBook.synopsis} />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        book={{ id: currentBook._id, title: currentBook.title, coverUrl: currentBook.cover }}
        author={{
          // `author.name` is the given name, not the full name: the surname is
          // a separate field, and it is often empty for independent authors.
          firstName: currentBook.author.name,
          lastName: currentBook.author.lastName,
        }}
        onSubmit={handleOrderSubmit}
      />

      <OrderSuccessToast visible={showSuccessToast} />
    </Wrapper>
  );
};

export default BookDetailPage;
