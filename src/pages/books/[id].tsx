import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import BookDetailPage from '../../views/BookDetailPage';
import { PublicZoneLayout } from '../../components/Layouts';
import { Seo } from '../../components';
import { Book } from '../../interfaces/books';
import { book as BOOK_URL } from '../../config/routes';
import {
  buildBookTitle,
  buildBookDescription,
  buildBookJsonLd,
  buildBreadcrumbJsonLd,
} from '../../utils/seo/bookSeo';

interface BookDetailRouteProps {
  book: Book;
}

// JSON.stringify escapes quotes and newlines but not the literal "</script>"
// sequence, so user-provided fields (e.g. a synopsis) could close the inline
// script tag early. Escaping every "<" as its unicode form neutralizes the
// breakout while keeping the JSON valid.
const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c');

const BookDetailRoute: React.FC<BookDetailRouteProps> = ({ book }) => {
  const title = buildBookTitle(book);
  const description = buildBookDescription(book);
  const bookJsonLd = buildBookJsonLd(book);
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(book);

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={`/books/${book._id}`}
        ogImage={book.cover}
      />
      <Head>
        {/* Server-rendered structured data so crawlers get it without JS. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(bookJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
        />
      </Head>
      <PublicZoneLayout>
        <BookDetailPage book={book} />
      </PublicZoneLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<BookDetailRouteProps> = async ({
  params,
}) => {
  const id = params?.id as string;

  try {
    const resp = await fetch(`${BOOK_URL}/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!resp.ok) {
      return { notFound: true };
    }

    // The API wraps the document as { book: {...} }.
    const json = await resp.json();
    const book: Book | undefined = json?.book;

    if (!book?._id) {
      return { notFound: true };
    }

    return { props: { book } };
  } catch (error) {
    // Network/parse failure: treat as a 404 so we never render a broken page.
    return { notFound: true };
  }
};

export default BookDetailRoute;
