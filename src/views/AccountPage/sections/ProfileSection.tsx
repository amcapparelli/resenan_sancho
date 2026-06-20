/* eslint-disable no-underscore-dangle */
import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import UserContext from '../../../store/context/userContext/UserContext';
import { useForm, useUploadImages } from '../../../utils/customHooks';
import { update as URL } from '../../../config/routes';
import { Response } from '../../../interfaces/response';
import SectionHeader from '../SectionHeader';
import AccountField, { FieldNote } from '../components/AccountField';
import CountrySelect from '../components/CountrySelect';
import SaveBar from '../components/SaveBar';
import DangerZone from '../components/DangerZone';
import { secondaryButton } from '../components/styles';

const getInitials = (name?: string, lastName?: string): string => {
  const first = name?.trim()[0] ?? '';
  const last = lastName?.trim()[0] ?? '';
  return `${first}${last}`.toUpperCase() || '?';
};

const ProfileSection: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user, setUserLogged } = useContext(UserContext);
  const [updateForm, setUpdateForm, loadForm] = useForm(user);
  const [avatarURL, uploadAvatar] = useUploadImages(updateForm.avatar);
  const [response, setResponse] = useState<Response>({ success: undefined, message: undefined });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadForm({ ...user });
  }, [user._id]);

  useEffect(() => {
    setUpdateForm('avatar', avatarURL);
  }, [avatarURL]);

  const update = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(URL, {
        method: 'post',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        body: JSON.stringify({ ...updateForm }),
        headers: {
          'Content-Type': 'application/json',
          'access-token': user.token,
        },
      });
      const resJSON = await res.json();
      const { message, success, user: userUpdated } = resJSON;
      setResponse({ message, success });
      setUserLogged({ ...userUpdated, token: user.token });
    } catch (error) {
      setResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const feedback = response.message
    ? { success: response.success, message: t(`responses.${response.message}`) }
    : undefined;

  return (
    <>
      <SectionHeader title="Tu perfil" subtitle="Estos datos identifican tu cuenta." />

      <AvatarRow>
        {updateForm.avatar
          ? <AvatarImg src={updateForm.avatar} alt="Tu avatar" />
          : <AvatarInitials aria-hidden="true">{getInitials(user.name, user.lastName)}</AvatarInitials>}
        <AvatarActions>
          <HiddenFileInput
            id="avatar-input"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => uploadAvatar(e, 'avatars')}
          />
          <AvatarButton htmlFor="avatar-input">Cambiar avatar</AvatarButton>
          <FieldNote>JPG o PNG, máximo 2 MB.</FieldNote>
        </AvatarActions>
      </AvatarRow>

      <FormGrid>
        <AccountField
          label={t('form.name')}
          name="name"
          value={updateForm.name ?? ''}
          onChange={(e) => setUpdateForm(e.target.name, e.target.value)}
          required
        />
        <AccountField
          label={t('form.lastName')}
          name="lastName"
          value={updateForm.lastName ?? ''}
          onChange={(e) => setUpdateForm(e.target.name, e.target.value)}
          required
        />
        <AccountField
          label={t('form.email')}
          name="email"
          value={updateForm.email ?? ''}
          disabled
          note="El email no se puede cambiar."
        />
        <CountrySelect
          className="full-width"
          label={t('components.countriesSelector.title')}
          value={updateForm.country ?? ''}
          onChange={(value) => setUpdateForm('country', value)}
        />
      </FormGrid>

      <SaveBar onSave={update} loading={loading} feedback={feedback} />

      <DangerZone userEmail={user.email} />
    </>
  );
};

const AvatarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 24px;
`;

const AvatarImg = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.lightBorder};
  object-fit: cover;
  flex-shrink: 0;
`;

const AvatarInitials = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.lightBorder};
  background: ${({ theme }) => theme.amber};
  color: ${({ theme }) => theme.ink};
  font-family: 'Fraunces', serif;
  font-weight: 600;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AvatarActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AvatarButton = styled.label`
  ${secondaryButton}
  align-self: flex-start;
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

export default ProfileSection;
