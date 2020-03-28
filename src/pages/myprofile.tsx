import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, TextField } from '@material-ui/core';
import UserContext from '../store/context/userContext/UserContext';
import { MyProfileLayout } from '../components/Layouts';
import useForm from '../utils/customHooks/useForm';

const MyProfile: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [updateForm, setUpdateForm] = useForm(user);

  return (
    <MyProfileLayout
      title={t('titles.updateProfile')}
    >
      <div>
        <TextField
          id="outlined-basic"
          label={t('form.name')}
          name="name"
          onChange={({ target: { name, value } }) => setUpdateForm(name, value)}
          variant="outlined"
          defaultValue={user.name}
        />
        <TextField
          id="outlined-basic"
          label={t('form.lastnameee')}
          name="name"
          onChange={({ target: { name, value } }) => setUpdateForm(name, value)}
          variant="outlined"
          defaultValue={user.lastName}
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
        >
          Actualizar
        </Button>
      </div>
    </MyProfileLayout>
  );
};

export default MyProfile;
