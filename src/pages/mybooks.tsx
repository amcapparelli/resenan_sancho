/* eslint-disable no-underscore-dangle */
import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import Alert from '@material-ui/lab/Alert';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import { Book } from '../interfaces/books';
import { booksListLoad } from '../store/reducers';
import { mybooks as URL } from '../config/routes';
import { MyBooksListItem } from '../components';
import { Response } from '../interfaces/response';

interface State {
  books: Array<Book>;
}
const initialState: State = {
  books: [],
};

const MyBooks: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const [state, dispatch] = useReducer(booksListLoad, initialState);
  useEffect(() => {
    async function fetchMyBooks() {
      try {
        const res = await fetch(`${URL}/${user._id}`, {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Token': user.token,
          },
        });
        const books = await res.json();
        dispatch({
          type: 'USER_BOOKS_LIST_LOAD',
          payload: books,
        });
      } catch (error) {
        setResponse(error);
      }
    }
    fetchMyBooks();
  }, []);

  return (
    <MyProfileLayout
      title={t('titles.mybooks')}
    >
      <div>
        <StyledList>
          {
            state.books && state.books.map(
              // eslint-disable-next-line no-underscore-dangle
              (book) => (
                <li key={book._id}>
                  <MyBooksListItem book={book} />
                </li>
              ),
            )
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
