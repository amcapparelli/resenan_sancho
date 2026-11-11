/* eslint-disable no-underscore-dangle */
import React, { useState, useContext, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';
import { useForm, useRequiredFieldsValidation, useFetchReviewer } from '../../../utils/customHooks';
import UserContext from '../../../store/context/userContext/UserContext';
import genres from '../../../utils/constants/genres';
import { registerBlog as URL } from '../../../config/routes';
import { AvailableMedias } from '../../../interfaces/mediaForm';
import { Response } from '../../../interfaces/response';
import { AmazonUrlKind, classifyAmazonUrl, normalizeAmazonProfileUrl } from '../../../utils/amazonProfileUrl';
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
import CharCounter from '../../../components/CharCounter';
import ChannelRow from '../components/ChannelRow';
import AmazonHelp from '../components/AmazonHelp';
import { fieldBase } from '../../../components/styles';

// Keep the previously enforced cap (the old input used maxLength 1000) to avoid
// a save regression, even though the design spec mentions 2000.
const DESCRIPTION_MAX = 1000;
const FORMATS = ['epub', 'papel', 'mobi', 'pdf', 'audiolibro'];

// Approved copy for each non-valid Amazon URL kind — see
// docs/amazon-profile-link-spec.md. `profile` is never read (it's the valid
// case) but is kept in the map so `AmazonUrlKind` can index it directly.
const AMAZON_URL_ERROR_MESSAGES: Record<AmazonUrlKind, string> = {
  profile: '',
  product: 'Este es el enlace de un producto, no de tu perfil. Necesitamos el que enseña tus reseñas.',
  account: 'Este es el enlace de tu cuenta privada: nadie más puede verlo. Necesitamos tu perfil público.',
  short: 'Es un enlace acortado. Ábrelo en el navegador y copia la dirección completa.',
  other: 'Este enlace no parece un perfil de Amazon.',
};

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

  // Blocking error for the Amazon URL field (checked on blur and on save),
  // and a separate non-blocking warning for a link that was already saved
  // before this validation existed. They're independent states: editing the
  // field clears the warning path for good (see `handleAmazonUrlBlur`), but
  // only a blur/save re-validates and can set/clear the error.
  const [amazonUrlError, setAmazonUrlError] = useState('');
  const [amazonUrlWarning, setAmazonUrlWarning] = useState('');
  const amazonUrlFieldRef = useRef<HTMLInputElement>(null);
  // The Amazon URL as it came from `reviewerResponse` on load — the value the
  // initial warning (if any) refers to. Blurring without editing shouldn't
  // escalate that warning into a blocking error (see spec: "Si la persona
  // edita el campo, pasa a aplicarse la validación normal").
  const initialAmazonUrlRef = useRef('');
  // Once the field has actually been edited (value differs from the one
  // loaded), normal blocking validation applies on every subsequent blur for
  // the rest of this session — no need to keep comparing against the original.
  const amazonUrlEditedRef = useRef(false);

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

      // A link saved before this validation existed doesn't block anything,
      // but it's still worth a heads-up — see "Enlaces ya guardados" in the spec.
      const savedAmazonUrl: string = getInitialMediaValues.amazon.url || '';
      const savedAmazonUrlKind = savedAmazonUrl.trim() ? classifyAmazonUrl(savedAmazonUrl) : 'profile';
      setAmazonUrlWarning(
        savedAmazonUrlKind !== 'profile' ? `Revisa este enlace: ${AMAZON_URL_ERROR_MESSAGES[savedAmazonUrlKind]}` : '',
      );
      setAmazonUrlError('');
      initialAmazonUrlRef.current = savedAmazonUrl;
      amazonUrlEditedRef.current = false;
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

  // Edited independently of `amazonUrlError`: once the person actually
  // changes the field's value (not just focuses and blurs it), the "saved
  // link is stale" warning is no longer relevant — this blur, and every one
  // after it, applies the normal (blocking) validation instead. Blurring
  // without changing the value leaves the warning/error untouched.
  const handleAmazonUrlBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    const url = event.target.value;
    if (!amazonUrlEditedRef.current) {
      if (url === initialAmazonUrlRef.current) return;
      amazonUrlEditedRef.current = true;
    }
    setAmazonUrlWarning('');
    if (!url.trim()) {
      setAmazonUrlError('');
      return;
    }
    const kind = classifyAmazonUrl(url);
    setAmazonUrlError(kind === 'profile' ? '' : AMAZON_URL_ERROR_MESSAGES[kind]);
  };

  const medias = Object.keys(AvailableMedias);
  const registerMedias = async (formToSave: typeof mediaForm = mediaForm): Promise<void> => {
    // Clean empty inputs when medias cards are not selected.
    const mediasFormClean = Object.entries(formToSave).reduce(
      (acum, [key, value]: any) => (
        (medias.includes(key) && value.selected === false)
          ? acum : { ...acum, [key]: value }
      ), {},
    );
    if (!isEditing && !succeeded) {
      ReactGA.event({
        category: 'Nuevo reseñador',
        action: 'new_reviewer',
        label: `${user.name} ${user.lastName || ''}`,
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
    // Amazon's URL gets a specific, blocking check before the generic
    // required-fields validation below: a non-empty value that isn't a
    // profile link is invalid regardless of whether it's "filled in".
    const amazonUrl = mediaForm.amazon.url || '';
    if (mediaForm.amazon.selected && amazonUrl.trim()) {
      const kind = classifyAmazonUrl(amazonUrl);
      if (kind !== 'profile') {
        setAmazonUrlWarning('');
        setAmazonUrlError(AMAZON_URL_ERROR_MESSAGES[kind]);
        amazonUrlFieldRef.current?.focus();
        return;
      }
    }
    setAmazonUrlError('');
    setAmazonUrlWarning('');

    // Save the canonical form of a valid Amazon link instead of whatever the
    // person pasted (e.g. with a `ref=` tracking param and query string).
    const normalizedAmazonUrl = mediaForm.amazon.selected && amazonUrl.trim()
      ? normalizeAmazonProfileUrl(amazonUrl)
      : null;
    const effectiveMediaForm = normalizedAmazonUrl && normalizedAmazonUrl !== amazonUrl
      ? { ...mediaForm, amazon: { ...mediaForm.amazon, url: normalizedAmazonUrl } }
      : mediaForm;
    if (effectiveMediaForm !== mediaForm) setMediaForm('amazon', effectiveMediaForm.amazon);

    const requiredMediaFields: Array<string> = medias.flatMap((media) => [`${media}URL`, `${media}Name`]);
    const requiredFields = ['genres', 'medias', 'description', 'formats', ...requiredMediaFields];
    // Build the object to validate based on which channels are selected.
    const fieldToValidate = () => {
      let mediasSelected = {};
      medias.forEach((media) => {
        if (effectiveMediaForm[media].selected) {
          mediasSelected = {
            ...mediasSelected,
            [`${media}URL`]: effectiveMediaForm[media].url,
            [`${media}Name`]: effectiveMediaForm[media].name,
          };
        }
      });
      if (Object.entries(mediasSelected).length === 0) {
        return { genres: effectiveMediaForm.genres, medias: [] as string[] };
      }
      return {
        genres: effectiveMediaForm.genres,
        formats: effectiveMediaForm.formats,
        description: effectiveMediaForm.description,
        ...mediasSelected,
      };
    };
    validateRequiredFields(fieldToValidate(), requiredFields, () => registerMedias(effectiveMediaForm));
  };

  const toggleInArray = (field: 'genres' | 'formats', value: string): void => {
    const current: string[] = mediaForm[field];
    setMediaForm(field, current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  };

  const hasValidationErrors = Object.values(errors).some((error: string) => error.length > 0) || !!amazonUrlError;
  const feedback = response.message
    ? { success: response.success, message: response.message }
    : undefined;

  return (
    <>
      <SectionHeader
        title="¿Dónde publicas tus reseñas literarias?"
        subtitle="Añade dónde publicas tus reseñas. Con Amazon ya es suficiente."
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
            errors={{
              url: key === 'amazon' ? (errors[`${key}URL`] || amazonUrlError) : errors[`${key}URL`],
              name: errors[`${key}Name`],
            }}
            urlWarning={key === 'amazon' ? amazonUrlWarning : undefined}
            urlFieldRef={key === 'amazon' ? amazonUrlFieldRef : undefined}
            onUrlBlur={key === 'amazon' ? handleAmazonUrlBlur : undefined}
            onToggle={() => setMediaForm(key, { ...mediaForm[key], selected: !mediaForm[key].selected })}
            onChange={({ target: { name, value } }) => setMediaForm(key, { ...mediaForm[key], [name]: value })}
            extraContent={key === 'amazon'
              ? <AmazonHelp helpId={`${key}-help`} forceOpen={!!amazonUrlError} />
              : undefined}
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
