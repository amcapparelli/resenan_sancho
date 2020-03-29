import React, { useContext, useState } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import useForm from '../utils/customHooks/useForm';
import { update as URL } from '../config/routes';

const MyProfile: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [response, setResponse] = useState<string>('');
  const { user } = useContext(UserContext);
  const [updateForm, setUpdateForm] = useForm(user);
  const update = (): void => {
    fetch(URL, {
      method: 'post',
      body: JSON.stringify({ ...updateForm }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then(({ message }) => setResponse(message))
      .catch((error) => setResponse(error));
  };
  return (
    <MyProfileLayout
      title={t('titles.updateProfile')}
    >
      <Alert severity="success" color="info">
        {response}
      </Alert>
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
            Actualizar
          </Button>
        </StyledButtonContainer>
      </div>
    </MyProfileLayout>
  );
};

const StyledForm = styledComponents.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
  width: 50%;
  position: fixed;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const StyledButtonContainer = styledComponents.div`
  float: right;
`;

export default MyProfile;
