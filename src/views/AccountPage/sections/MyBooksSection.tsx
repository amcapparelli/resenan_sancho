/* eslint-disable no-underscore-dangle */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import UserContext from '../../../store/context/userContext/UserContext';
import { ModalPromotions } from '../../../components';
import { useUsersBooksListFetch, useFetch } from '../../../utils/customHooks';
import { suscribeAuthor as URL } from '../../../config/routes';
import { Book } from '../../../interfaces/books';
import SectionHeader from '../SectionHeader';
import BooksEmptyState from '../components/BooksEmptyState';
import BookManageRow from '../components/BookManageRow';
import MyBooksSkeleton from '../components/MyBooksSkeleton';
import Toggle from '../components/Toggle';
import { primaryButton, secondaryButton } from '../components/styles';

const MyBooksSection: React.FC = (): JSX.Element => {
  const router = useRouter();
  const { user, setUserLogged } = useContext(UserContext);
  const [state, listRequest, loading, response] = useUsersBooksListFetch();
  const [showModalPromotions, setShowModalPromotions] = useState(false);
  const [bookSelected, setBookSelected] = useState<Book>();
  const [suscribe, setSuscribe] = useState<boolean>(
    !!(user.emailAuthorListStatus && user.emailAuthorListStatus === 'subscribed'),
  );
  const [suscribeUserResponse, suscribeUserRequest] = useFetch();

  useEffect(() => {
    if (!showModalPromotions && user._id !== undefined) listRequest(user._id);
  }, [showModalPromotions, user._id]);

  useEffect(() => {
    if (suscribeUserResponse.success) {
      setUserLogged({ ...user, emailAuthorListStatus: suscribe ? 'subscribed' : 'unsubscribed' });
    }
  }, [suscribeUserResponse.message]);

  useEffect(() => {
    setSuscribe(!!(user.emailAuthorListStatus && user.emailAuthorListStatus === 'subscribed'));
  }, [user.emailAuthorListStatus]);

  const handleSuscribe = () => {
    suscribeUserRequest(URL, 'post', {
      _id: user._id,
      status: suscribe ? 'subscribed' : 'unsubscribed',
    });
  };

  const currentlySubscribed = user.emailAuthorListStatus === 'subscribed';
  const subscribeUnchanged = currentlySubscribed === suscribe;

  const hasBooks = state.books && state.books.length > 0;

  return (
    <>
      <SectionHeader
        title="Tus libros"
        subtitle="Gestiona tus libros y sus ejemplares."
        action={(
          <AddButton type="button" onClick={() => router.push('/account?section=addBook')}>
            + Añadir libro
          </AddButton>
        )}
      />

      {hasBooks && (
        <SubscribeBar>
          <Toggle
            checked={suscribe}
            onChange={setSuscribe}
            label="Recibir consejos por email para promocionar mis libros"
            labelledBy="subscribe-label"
          />
          <SubscribeText id="subscribe-label">
            Quiero recibir consejos vía email para promocionar mis libros
          </SubscribeText>
          <SaveSubscribeButton type="button" onClick={handleSuscribe} disabled={subscribeUnchanged}>
            Guardar selección
          </SaveSubscribeButton>
          {suscribeUserResponse.message && (
            <SubscribeFeedback $success={!!suscribeUserResponse.success} role="status">
              {suscribeUserResponse.success ? 'Preferencia guardada' : 'No se pudo guardar'}
            </SubscribeFeedback>
          )}
        </SubscribeBar>
      )}

      {response.message && !loading && (
        <ErrorBanner role="alert">
          <span aria-hidden="true">⚠</span>
          {response.message}
        </ErrorBanner>
      )}

      {/* eslint-disable-next-line no-nested-ternary */}
      {loading
        ? <MyBooksSkeleton />
        : hasBooks
          ? state.books.map((book) => (
            <BookManageRow
              key={book._id}
              title={book.title}
              coverUrl={book.cover}
              genre={book.genre}
              formats={book.formats}
              availableCopies={book.copies}
              onPromote={() => {
                setShowModalPromotions(true);
                setBookSelected(book);
              }}
              onEdit={() => router.push(`/account?section=addBook&book=${book._id}`)}
            />
          ))
          : <BooksEmptyState />}

      <ModalPromotions
        bookSelected={bookSelected}
        show={showModalPromotions}
        onClose={() => setShowModalPromotions(false)}
      />
    </>
  );
};

const AddButton = styled.button`
  ${secondaryButton}
  font-size: 13px;
  padding: 8px 16px;
  min-height: 40px;
`;

const SubscribeBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.lightBorder};
  border-radius: 10px;
  background: ${({ theme }) => theme.cream};
`;

const SubscribeText = styled.span`
  flex: 1;
  min-width: 180px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};
`;

// Enabled = solid terracotta CTA (a pending change to save); disabled = flat,
// muted outline. The strong contrast makes the actionable state obvious.
const SaveSubscribeButton = styled.button`
  ${primaryButton}
  font-size: 13px;
  padding: 8px 16px;
  min-height: 40px;

  &:disabled {
    opacity: 1;
    background: transparent;
    color: ${({ theme }) => theme.muted};
    border: 1px solid ${({ theme }) => theme.lightBorder};
  }
`;

const SubscribeFeedback = styled.span<{ $success: boolean }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ $success, theme }) => ($success ? theme.success : theme.terracotta)};
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ theme }) => theme.terracottaSoft};
  border: 1px solid ${({ theme }) => theme.terracotta};
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.ink};
`;

export default MyBooksSection;
