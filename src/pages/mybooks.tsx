/* eslint-disable no-underscore-dangle */
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import {
  AddBook,
  MyBooksListItem,
  ModalPromotions,
  Loading,
} from '../components';
import { useUsersBooksListFetch, useFetch } from '../utils/customHooks';
import { suscribeAuthor as URL } from '../config/routes';
import { Book } from '../interfaces/books';

const MyBooks: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
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

  const handleSuscribe = () => {
    suscribeUserRequest(URL, 'post', {
      _id: user._id,
      status: suscribe ? 'subscribed' : 'unsubscribed',
    });
  };

  return (
    <MyProfileLayout
      title={t('titles.mybooks')}
    >
      <div>
        {
          loading && <Loading />
        }
        {
          !loading && state.books && state.books.length > 0
          && (
            <StyledCard>
              <CardContent>
                <FormControlLabel
                  control={(
                    <Switch
                      checked={suscribe}
                      onChange={() => setSuscribe(!suscribe)}
                      name="suscribe"
                      color="primary"
                    />
                  )}
                  label="Quiero recibir consejos vía email para promocionar mis libros"
                />
                <Button
                  disabled={
                    (user.emailAuthorListStatus === 'subscribed' && suscribe)
                    || (user.emailAuthorListStatus !== 'subscribed' && !suscribe)
                  }
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleSuscribe}
                >
                  Guardar Cambio
                </Button>
                {
                  suscribeUserResponse.message
                  && (
                    <Alert variant="filled" severity={suscribeUserResponse.success ? 'success' : 'error'}>
                      {suscribeUserResponse.message}
                    </Alert>
                  )
                }
              </CardContent>
            </StyledCard>
          )
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

const StyledCard = styledComponents(Card)`
  width: 50%;
  margin-left: 25%;
`;

const StyledList = styledComponents.ul`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
`;

export default MyBooks;
