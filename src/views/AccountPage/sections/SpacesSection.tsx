/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import { useForm, useRequiredFieldsValidation, useFetchReviewer } from '../../../utils/customHooks';
import UserContext from '../../../store/context/userContext/UserContext';
import genres from '../../../utils/constants/genres';
import { registerBlog as URL } from '../../../config/routes';
import { AvailableMedias } from '../../../interfaces/mediaForm';
import { Response } from '../../../interfaces/response';
import {
  BlogIcon,
  YoutubeIcon,
  InstagramIcon,
  GoodreadsIcon,
  AmazonIcon,
} from '../../../utils/channelIcons';
import SectionHeader from '../SectionHeader';
import SaveBar from '../components/SaveBar';
import SelectableChip from '../components/SelectableChip';
import CharCounter from '../components/CharCounter';
import ChannelRow from '../components/ChannelRow';
import { fieldBase } from '../components/styles';

// Keep the previously enforced cap (the old input used maxLength 1000) to avoid
// a save regression, even though the design spec mentions 2000.
const DESCRIPTION_MAX = 1000;
const FORMATS = ['epub', 'papel', 'mobi', 'pdf', 'audiolibro'];

// Display-only labels; the stored values (the keys) are sent to the backend
// unchanged.
const FORMAT_LABELS: Record<string, string> = {
  epub: 'ePUB',
  papel: 'papel',
  mobi: 'mobi',
  pdf: 'PDF',
  audiolibro: 'audiolibro',
};

// Display order/labels for channels; each maps to a data key in mediaForm.
const CHANNELS: Array<{ key: string; label: string; Icon: React.FC<{ size?: number }> }> = [
  { key: 'blog', label: 'Blog', Icon: BlogIcon },
  { key: 'booktube', label: 'Booktube', Icon: YoutubeIcon },
  { key: 'bookstagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'goodreads', label: 'Goodreads', Icon: GoodreadsIcon },
  { key: 'amazon', label: 'Amazon', Icon: AmazonIcon }
];

const defaultMediaValues = {
  blog: { selected: false, url: '', name: '' },
  booktube: { selected: false, url: '', name: '' },
  bookstagram: { selected: false, url: '', name: '' },
  goodreads: { selected: false, url: '', name: '' },
  amazon: { selected: false, url: '', name: '' },
};

const SpacesSection: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user, setUserLogged } = useContext(UserContext);
  const [requestReviewer, reviewerResponse] = useFetchReviewer();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [mediaForm, setMediaForm, loadForm] = useForm({
    author: user._id,
    genres: [],
    formats: [],
    description: '',
    ...defaultMediaValues,
  });

  useEffect(() => {
    if (user._id) requestReviewer(user._id);
  }, [user._id]);

  useEffect(() => {
    const getInitialMediaValues = Object.keys(AvailableMedias).reduce((object, key) => ({
      ...object,
      [key]: {
        selected: !!reviewerResponse[key],
        url: reviewerResponse[key] && reviewerResponse[key].url,
        name: reviewerResponse[key] && reviewerResponse[key].name,
      },
    }), defaultMediaValues);
    if (Object.keys(reviewerResponse).length > 0) {
      setIsEditing(true);
      loadForm({
        author: user._id,
        genres: reviewerResponse.genres,
        formats: reviewerResponse.formats,
        description: reviewerResponse.description,
        blog: getInitialMediaValues.blog,
        booktube: getInitialMediaValues.booktube,
        bookstagram: getInitialMediaValues.bookstagram,
        goodreads: getInitialMediaValues.goodreads,
        amazon: getInitialMediaValues.amazon,
      });
    }
  }, [reviewerResponse.author]);

  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [response, setResponse] = useState<Response>({ success: undefined, message: undefined });
  const initErrors = {
    genres: '',
    description: '',
  };
  const [errors, validateRequiredFields] = useRequiredFieldsValidation(initErrors);
  const [loading, setLoading] = useState(false);

  const medias = Object.keys(AvailableMedias);
  const registerMedias = async (): Promise<void> => {
    // Clean empty inputs when medias cards are not selected.
    const mediasFormClean = Object.entries(mediaForm).reduce(
      (acum, [key, value]: any) => (
        (medias.includes(key) && value.selected === false)
          ? acum : { ...acum, [key]: value }
      ), {},
    );
    if (!isEditing && !succeeded) {
      ReactGA.event({
        category: 'Nuevo reseñador',
        action: `Reseñador ${user.name} ${user.lastName || ''}`,
      });
    }
    try {
      setLoading(true);
      const res = await fetch(URL, {
        method: isEditing || succeeded ? 'put' : 'post',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify({ ...mediasFormClean }),
        headers: {
          'Content-Type': 'application/json',
          'access-token': user.token,
        },
      });
      const resJSON = await res.json();
      const { message, success, reviewer } = resJSON;
      if (resJSON.error) {
        setResponse({
          message: resJSON.error.errors[Object.keys(resJSON.error.errors)[0]].message,
          success: false,
        });
        return;
      }
      setResponse({ message, success });
      if (success) {
        setUserLogged({ ...user, reviewerInfo: reviewer });
        setSucceeded(true);
      }
    } catch (error) {
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    const requiredMediaFields: Array<string> = medias.flatMap((media) => [`${media}URL`, `${media}Name`]);
    const requiredFields = ['genres', 'medias', 'description', 'formats', ...requiredMediaFields];
    // Build the object to validate based on which channels are selected.
    const fieldToValidate = () => {
      let mediasSelected = {};
      medias.forEach((media) => {
        if (mediaForm[media].selected) {
          mediasSelected = {
            ...mediasSelected,
            [`${media}URL`]: mediaForm[media].url,
            [`${media}Name`]: mediaForm[media].name,
          };
        }
      });
      if (Object.entries(mediasSelected).length === 0) {
        return { genres: mediaForm.genres, medias: [] as string[] };
      }
      return {
        genres: mediaForm.genres,
        formats: mediaForm.formats,
        description: mediaForm.description,
        ...mediasSelected,
      };
    };
    validateRequiredFields(fieldToValidate(), requiredFields, registerMedias);
  };

  const toggleInArray = (field: 'genres' | 'formats', value: string): void => {
    const current: string[] = mediaForm[field];
    setMediaForm(field, current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  };

  const hasValidationErrors = Object.values(errors).some((error: string) => error.length > 0);
  const feedback = response.message
    ? { success: response.success, message: response.message }
    : undefined;

  return (
    <>
      <SectionHeader
        title="¿Dónde publicas tus reseñas literarias?"
        subtitle="Añade tus canales para aparecer en el listado de reseñadores."
      />

      {errors.medias && <BlockError>Debes seleccionar al menos un canal.</BlockError>}
      <div>
        {CHANNELS.map(({ key, label, Icon }) => (
          <ChannelRow
            key={key}
            channelKey={key}
            label={label}
            Icon={Icon}
            selected={mediaForm[key].selected}
            url={mediaForm[key].url}
            name={mediaForm[key].name}
            errors={{ url: errors[`${key}URL`], name: errors[`${key}Name`] }}
            onToggle={() => setMediaForm(key, { ...mediaForm[key], selected: !mediaForm[key].selected })}
            onChange={({ target: { name, value } }) => setMediaForm(key, { ...mediaForm[key], [name]: value })}
          />
        ))}
      </div>

      <Divider />

      <Block
        role="group"
        aria-labelledby="genres-label"
        aria-describedby={errors.genres ? 'genres-error' : undefined}
      >
        <BlockLabel id="genres-label">Géneros que te interesan</BlockLabel>
        <BlockHelp>Marca todos los que apliquen.</BlockHelp>
        {errors.genres && <BlockError id="genres-error">Selecciona al menos un género.</BlockError>}
        <Chips>
          {genres.map(({ name, code }) => (
            <SelectableChip
              key={code}
              label={t(`genres.${name}`)}
              selected={mediaForm.genres.includes(name)}
              onToggle={() => toggleInArray('genres', name)}
            />
          ))}
        </Chips>
      </Block>

      <Divider />

      <Block>
        <BlockLabel as="label" htmlFor="reviewer-description">
          Cómo te gusta escribir tus reseñas
        </BlockLabel>
        <BlockHelp>{t('helpers.describeYourself')}</BlockHelp>
        <Textarea
          id="reviewer-description"
          name="description"
          value={mediaForm.description}
          maxLength={DESCRIPTION_MAX}
          onChange={({ target: { name, value } }) => setMediaForm(name, value)}
        />
        <CharCounter value={mediaForm.description.length} max={DESCRIPTION_MAX} />
      </Block>

      <Divider />

      <Block role="group" aria-labelledby="formats-label">
        <BlockLabel id="formats-label">Formatos que sueles leer</BlockLabel>
        <Chips>
          {FORMATS.map((format) => (
            <SelectableChip
              key={format}
              label={FORMAT_LABELS[format] ?? format}
              selected={mediaForm.formats.includes(format)}
              onToggle={() => toggleInArray('formats', format)}
            />
          ))}
        </Chips>
      </Block>

      <SaveBar onSave={submit} loading={loading} saveLabel="Guardar" feedback={feedback} />
      {hasValidationErrors && <BlockError>Revisa el formulario, tienes errores.</BlockError>}
    </>
  );
};

const Divider = styled.div`
  border-top: 0.5px solid #e8dfc8;
  margin: 24px 0;
`;

const Block = styled.section``;

const BlockLabel = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${({ theme }) => theme.brown};
  margin: 0 0 4px;
`;

const BlockHelp = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.muted};
  margin: 0 0 12px;
`;

const BlockError = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  color: ${({ theme }) => theme.danger};
  margin: 0 0 12px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Textarea = styled.textarea`
  ${fieldBase}
  min-height: 120px;
  padding: 12px 14px;
  line-height: 1.6;
  resize: vertical;
`;

export default SpacesSection;
