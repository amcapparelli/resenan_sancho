import React from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { MyProfileLayout } from '../components/Layouts';


const Help: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      <MyProfileLayout
        title={t('titles.help')}
      >
        <Card>
          <CardContent>
            <StyledContainer>
              <Typography variant="h5">Mi libro no aparece en el listado de libros disponibles</Typography>
              <Typography variant="body1">
                Para que un libro aparezca en el listado lo primero que debes hacer es darlo
                de alta con la opción del menú AÑADE LIBRO. Luego, en la opción MIS LIBROS,
                puedes administrar tus ejemplares. Para que un libro aparezca en el listado debe
                tener ejemplares disponibles. Para agregar ejemplares disponibles de tu libro,
                puedes hacerlo con la opción PROMOCIONAR.
              </Typography>
            </StyledContainer>
            <StyledContainer>
              <Typography variant="h5">
                ¿Tienes una duda, algún comentario o algo no funciona cómo esperabas?
              </Typography>
              <Typography variant="body1">
                No dudes en escribir a alejandro@resenansancho.com
              </Typography>
            </StyledContainer>
          </CardContent>
        </Card>
      </MyProfileLayout>
    </>
  );
};

const StyledContainer = styledComponents.div`
  margin-bottom: 5%;
  width: 90%;
`;

export default Help;
