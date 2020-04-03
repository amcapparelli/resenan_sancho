import React, { useContext, useState } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Button,
  TextField,
  IconButton,
  Collapse,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import useForm from '../utils/customHooks/useForm';
import { update as URL } from '../config/routes';

interface Response {
  success: boolean,
  message: string
}

const MyProfile: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [response, setResponse] = useState<Response>({
    success: undefined,
    message: undefined,
  });
  const { user } = useContext(UserContext);
  const [updateForm, setUpdateForm] = useForm(user);
  const [open, setOpen] = useState(false);
  const update = async (): Promise<void> => {
    try {
      const res = await fetch(URL, {
        method: 'post',
        body: JSON.stringify({ ...updateForm }),
        headers: { 'Content-Type': 'application/json' },
      });
      const resJSON = await res.json();
      const {
        message,
        success,
      } = resJSON;
      setResponse({ message, success });
      setOpen(true);
    } catch (error) {
      setResponse(error);
      setOpen(true);
    }
  };
  return (
    <>
      <MyProfileLayout
        title={t('titles.updateProfile')}
      >
        <div>
          <StyledForm>
            {
              ['name', 'lastName', 'email'].map((text) => (
                <TextField
                  id="outlined-basic"
                  label={t(`form.${text}`)}
                  name={text}
                  onChange={({ target: { name, value } }) => setUpdateForm(name, value)}
                  variant="outlined"
                  defaultValue={user[text]}
                />
              ))
            }
          </StyledForm>
          <StyledButtonContainer>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={update}
            >
              {t('buttons.update')}
            </Button>
          </StyledButtonContainer>
        </div>
      </MyProfileLayout>
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
    </>
  );
};

const StyledForm = styledComponents.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  width: 50%;
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledButtonContainer = styledComponents.div`
  float: right;
`;

const StyledResponseContainer = styledComponents.div`
  width: 25%;
  position: fixed;
  top: 15%;
  left: 40%;
`;

export default MyProfile;
