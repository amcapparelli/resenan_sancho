/* eslint-disable no-underscore-dangle */
import React, { useContext, useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Collapse,
  IconButton,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import DeleteIcon from '@material-ui/icons/Delete';
import ReactGA from 'react-ga';
import { trackingId } from '../utils/constants/GATrackingID';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import { UploadImagesInput, CountriesSelector, ModalDeleteAccount } from '../components';
import { useForm, useUploadImages } from '../utils/customHooks';
import { update as URL } from '../config/routes';
import { Response } from '../interfaces/response';

const useStyles = makeStyles((theme: Theme) => createStyles({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    alignContent: 'center',
    justifySelf: 'center',
    justifyContent: 'center',
  },
}));

const MyProfile: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const { user, setUserLogged } = useContext(UserContext);
  const [updateForm, setUpdateForm, loadForm] = useForm(user);
  const [avatarURL, uploadAvatar] = useUploadImages(updateForm.avatar);
  const [open, setOpen] = useState(false);
  const [openDeleteAccountModal, setDeleteAccountModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadForm({ ...user });
  }, [user._id]);

  useEffect(() => {
    setUpdateForm('avatar', avatarURL);
  }, [avatarURL]);

  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.pageview('/myprofile');
  }, []);

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
        },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
        user: userUpdated,
      } = resJSON;
      setResponse({ message, success });
      setUserLogged({ ...userUpdated, token: user.token });
      setOpen(true);
    } catch (error) {
      setResponse(error);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <MyProfileLayout
        title={t('titles.updateProfile')}
      >
        <StyledCard>
          <StyledAvatarContainer>
            <UploadImagesInput
              text="Sube tu Avatar"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => uploadAvatar(e, 'avatars')}
            />
            {
              updateForm.avatar
              && <Avatar alt="avatar" src={updateForm.avatar} className={classes.large} />
            }
          </StyledAvatarContainer>
          <StyledContentContainer>
            <StyledForm>
              {
                ['name', 'lastName', 'email'].map((text) => (
                  <TextField
                    id="outlined-basic"
                    label={t(`form.${text}`)}
                    name={text}
                    onChange={({ target: { name, value } }) => setUpdateForm(name, value)}
                    variant={text === 'email' ? 'filled' : 'outlined'}
                    defaultValue={user[text]}
                    InputProps={{
                      readOnly: (text === 'email'),
                    }}
                  />
                ))
              }
              <CountriesSelector
                onChange={(
                  { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
                ) => setUpdateForm(name, value)}
                countrySelected={updateForm.country || user.country}
              />
            </StyledForm>
            <StyledButton
              disabled={loading}
              variant="contained"
              color="primary"
              size="large"
              onClick={update}
            >
              {loading ? t('buttons.saving') : t('buttons.update')}
            </StyledButton>
            <StyledResponseContainer>
              {
                response.message
                && (
                  <Collapse in={open}>
                    <Alert
                      action={(
                        <IconButton
                          aria-label="close"
                          color="inherit"
                          size="small"
                          onClick={() => {
                            setOpen(false);
                          }}
                        >
                          <CloseIcon fontSize="inherit" />
                        </IconButton>
                      )}
                      variant="filled"
                      severity={response.success ? 'success' : 'error'}
                    >
                      {response.message}
                    </Alert>
                  </Collapse>
                )
              }
            </StyledResponseContainer>
          </StyledContentContainer>
          <IconButton
            aria-label="delete"
            size="small"
            color="secondary"
            onClick={() => setDeleteAccountModal(true)}
          >
            <DeleteIcon fontSize="small" color="secondary" />
            Eliminar mi cuenta
          </IconButton>
          <ModalDeleteAccount
            open={openDeleteAccountModal}
            onClose={() => setDeleteAccountModal(false)}
          />
        </StyledCard>
      </MyProfileLayout>
    </>
  );
};


const StyledCard = styledComponents(Card)`
  display: grid;
  grid-template-columns: 1fr 3fr;
`;

const StyledAvatarContainer = styledComponents.div`
  display: grid;
  grid-template-rows: 0.5fr 2fr;
  grid-gap: 0.5rem;
  justify-content: center;
  padding-top: 1rem;
`;

const StyledForm = styledComponents.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  width: 90%;
  justify-self: center;
`;

const StyledButton = styledComponents(Button)`
  width: 30%;
  justify-self: center;
`;

const StyledContentContainer = styledComponents(CardContent)`
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
`;

const StyledResponseContainer = styledComponents.div`
  width: 30%;
  justify-self: center;
`;

export default MyProfile;
