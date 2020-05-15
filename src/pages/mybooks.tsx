/* eslint-disable no-underscore-dangle */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import {
  AddBook,
  MyBooksListItem,
  ModalPromotions,
  Loading,
} from '../components';
import { useUsersBooksListFetch } from '../utils/customHooks';
import { Book } from '../interfaces/books';

const MyBooks: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [state, listRequest, loading, response] = useUsersBooksListFetch();
  const [showModalPromotions, setShowModalPromotions] = useState(false);
  const [bookSelected, setBookSelected] = useState<Book>();

  useEffect(() => {
    if (!showModalPromotions) listRequest(user._id);
  }, [showModalPromotions]);

  return (
    <MyProfileLayout
      title={t('titles.mybooks')}
    >
      <div>
        {
          loading && <Loading />
        }
        <StyledList>
          {
            state.books && state.books.length > 0
              ? state.books.map(
                // eslint-disable-next-line no-underscore-dangle
                (book) => (
                  <li key={book._id}>
                    <MyBooksListItem
                      onClickEdit={() => router.push(`/addBook?book=${book._id}`)}
                      onClickPromote={() => {
                        setShowModalPromotions(true);
                        setBookSelected(book);
                      }}
                      book={book}
                    />
                  </li>
                ),
              )
              : !loading && <AddBook />
          }
        </StyledList>
        {
          response.message
          && (
            <Alert variant="filled" severity={response.success ? 'success' : 'error'}>
              {response.message}
            </Alert>
          )
        }
        <ModalPromotions
          bookSelected={bookSelected}
          show={showModalPromotions}
          onClose={() => setShowModalPromotions(false)}
        />
      </div>
    </MyProfileLayout>
  );
};

const StyledList = styledComponents.ul`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
`;

export default MyBooks;
