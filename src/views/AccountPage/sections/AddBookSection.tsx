/* eslint-disable no-underscore-dangle */
import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import {
  useForm,
  useUploadImages,
  useRequiredFieldsValidation,
  useFetchBook,
  useFetch,
} from '../../../utils/customHooks';
import UserContext from '../../../store/context/userContext/UserContext';
import { registerBook as URL } from '../../../config/routes';
import genres from '../../../utils/constants/genres';
import { BookForm, BookFormErrors } from '../../../interfaces/books';
import SectionHeader from '../SectionHeader';
import AccountField, { FieldLabel, FieldError } from '../components/AccountField';
import AccountSelect from '../components/AccountSelect';
import CoverUploader from '../components/CoverUploader';
import SelectableChip from '../components/SelectableChip';
import CharCounter from '../components/CharCounter';
import SaveBar from '../components/SaveBar';
import { fieldBase } from '../components/styles';

const SYNOPSIS_MAX = 2000;
const FORMATS = ['epub', 'papel', 'mobi', 'pdf', 'audiolibro'];
const FORMAT_LABELS: Record<string, string> = {
  epub: 'ePUB',
  papel: 'papel',
  mobi: 'mobi',
  pdf: 'PDF',
  audiolibro: 'audiolibro',
};

// Format a stored date (Date, ISO string or '') for an <input type="date">.
const toDateInputValue = (value: unknown): string => {
  if (!value) return '';
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const AddBookSection: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query: { book } } = router;
  const { user } = useContext(UserContext);
  const [state, fetchBook] = useFetchBook();
  const [registerBookResponse, registerBookRequest, loading] = useFetch();

  const initForm: BookForm = {
    title: '',
    cover: '',
    formats: [],
    datePublished: '',
    author: user._id,
    synopsis: '',
    genre: '',
    pages: '',
  };
  const [bookForm, setBookForm, loadForm] = useForm(initForm);

  const initErrors: BookFormErrors = {
    title: '',
    cover: '',
    formats: '',
    datePublished: '',
    author: '',
    synopsis: '',
    editorial: '',
    genre: '',
    pages: '',
  };
  const [errors, validateRequiredFields] = useRequiredFieldsValidation(initErrors);

  const [coverURL, uploadCover, loadingCover] = useUploadImages(initForm.cover);

  useEffect(() => {
    setBookForm('cover', coverURL);
  }, [coverURL]);

  useEffect(() => {
    if (book) fetchBook(book);
  }, [book]);

  useEffect(() => {
    const {
      title, synopsis, cover, editorial, formats, genre, pages, datePublished,
    } = state;
    loadForm({
      ...initForm, title, synopsis, cover, editorial, formats, genre, pages, datePublished,
    });
  }, [state]);

  // On a successful publish/update, take the user to "Mis libros" to see it.
  useEffect(() => {
    if (registerBookResponse.success) router.push('/account?section=books');
  }, [registerBookResponse.success]);

  const registerBook = async (): Promise<void> => {
    if (!book) {
      registerBookRequest(URL, 'post', bookForm);
      ReactGA.event({
        category: 'Nuevo Libro',
        action: `Libro ${bookForm.title}`,
      });
    } else {
      registerBookRequest(`${URL}/${book}`, 'put', bookForm);
    }
  };

  const submit = () => {
    const requiredFields = ['title', 'synopsis', 'genre', 'cover', 'pages', 'formats', 'datePublished'];
    validateRequiredFields(bookForm, requiredFields, registerBook);
  };

  const toggleFormat = (format: string): void => {
    setBookForm('formats', bookForm.formats.includes(format)
      ? bookForm.formats.filter((item: string) => item !== format)
      : [...bookForm.formats, format]);
  };

  const genreOptions = genres
    .map(({ name, code }) => ({ value: code, label: t(`genres.${name}`) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const feedback = registerBookResponse.message
    ? { success: registerBookResponse.success, message: registerBookResponse.message }
    : undefined;

  return (
    <>
      <SectionHeader
        title="Añade un libro"
        subtitle="Publica los datos del libro que quieres dar a reseñar."
      />

      <Layout>
        <CoverUploader
          cover={bookForm.cover}
          loading={loadingCover}
          error={errors.cover}
          onSelectFile={(e) => uploadCover(e, 'covers')}
        />

        <FormGrid>
          <AccountField
            className="full-width"
            label={t('booksForm.title')}
            name="title"
            value={bookForm.title || ''}
            onChange={({ target: { name, value } }) => setBookForm(name, value)}
            required
            error={errors.title}
          />

          <AccountField
            className="full-width"
            label={t('booksForm.author')}
            name="author"
            value={`${user.name} ${user.lastName || ''}`.trim()}
            disabled
            note="Se publica con tu nombre de perfil."
          />

          <SynopsisField className="full-width">
            <FieldLabel htmlFor="synopsis">Sinopsis</FieldLabel>
            <Textarea
              id="synopsis"
              name="synopsis"
              value={bookForm.synopsis || ''}
              maxLength={SYNOPSIS_MAX}
              onChange={({ target: { name, value } }) => setBookForm(name, value)}
            />
            {errors.synopsis
              ? (
                <FieldError>
                  <span aria-hidden="true">⚠</span>
                  {errors.synopsis}
                </FieldError>
              )
              : <CharCounter value={(bookForm.synopsis || '').length} max={SYNOPSIS_MAX} />}
          </SynopsisField>

          <AccountField
            label={t('booksForm.editorial')}
            name="editorial"
            value={bookForm.editorial || ''}
            onChange={({ target: { name, value } }) => setBookForm(name, value)}
            note="Déjalo vacío si es independiente."
          />

          <AccountField
            label="Fecha de publicación"
            name="datePublished"
            type="date"
            value={toDateInputValue(bookForm.datePublished)}
            onChange={({ target: { value } }) => setBookForm('datePublished', value ? new Date(value) : '')}
            error={errors.datePublished}
          />

          <AccountSelect
            label="Género literario"
            name="genre"
            value={bookForm.genre || ''}
            options={genreOptions}
            onChange={(value) => setBookForm('genre', value)}
            error={errors.genre}
          />

          <AccountField
            label="Nº de páginas"
            name="pages"
            type="number"
            value={bookForm.pages || ''}
            onChange={({ target: { name, value } }) => setBookForm(name, value)}
            error={errors.pages}
          />

          <FormatsField className="full-width" role="group" aria-labelledby="addbook-formats-label">
            <FieldLabel as="span" id="addbook-formats-label">Formatos disponibles</FieldLabel>
            <Chips>
              {FORMATS.map((format) => (
                <SelectableChip
                  key={format}
                  label={FORMAT_LABELS[format] ?? format}
                  selected={bookForm.formats.includes(format)}
                  onToggle={() => toggleFormat(format)}
                />
              ))}
            </Chips>
            {errors.formats && (
              <FieldError>
                <span aria-hidden="true">⚠</span>
                {errors.formats}
              </FieldError>
            )}
          </FormatsField>
        </FormGrid>
      </Layout>

      <SaveBar
        onSave={submit}
        loading={loading}
        saveLabel={book ? 'Actualizar libro' : 'Publicar libro'}
        feedback={feedback}
      />
      <Reminder>
        Para que aparezca en las búsquedas, recuerda añadir ejemplares desde «Mis libros».
      </Reminder>
    </>
  );
};

const Layout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 28px;
  align-items: start;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SynopsisField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Textarea = styled.textarea`
  ${fieldBase}
  min-height: 120px;
  padding: 12px 14px;
  line-height: 1.6;
  resize: vertical;
`;

const FormatsField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Reminder = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
  margin: 12px 0 0;
  text-align: right;

  @media (max-width: 480px) {
    text-align: left;
  }
`;

export default AddBookSection;
