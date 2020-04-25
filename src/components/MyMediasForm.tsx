import React, { useState } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  FormControlLabel,
  FormHelperText,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    maxWidth: 250,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

interface MyProps {
  media: string,
  onChange: Function,
  onSelect: Function,
  selected: boolean,
  url: string,
  name: string,
  errors: {
    url: string,
    name: string,
  }
}

const MyMediasForm: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const { t } = useTranslation();
  const classes = useStyles();
  const {
    errors,
    media,
    onChange,
    onSelect,
    selected,
    url,
    name,
  } = props;
  const [expanded, setExpanded] = useState(selected);
  const handleExpandClick = () => {
    setExpanded(!expanded);
    onSelect();
  };

  const showIcon = (type: string) => {
    switch (type) {
      case 'booktube': {
        return '/static/iconoyoutube.jpg';
      }
      case 'bookstagram': {
        return '/static/iconoinstagram.jpg';
      }
      case 'goodreads': {
        return '/static/iconogoodreads.png';
      }
      case 'amazon': {
        return '/static/iconoamazon.png';
      }
      default: return '/static/iconoreseñas.jpg';
    }
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        title={media}
      />
      <CardMedia
        className={classes.media}
        image={showIcon(media)}
        title="Paella dish"
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {`Agrega debajo la dirección de tu ${media} para que podamos mostrarla a escritores y editoriales.`}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <FormControlLabel
          control={(
            <Switch
              checked={expanded}
              onChange={handleExpandClick}
              name="checkedB"
              color="primary"
            />
          )}
          label={t(`mediasCards.switch.${media}`)}
        />
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <StyledInputsContainer>
          <div>
            <TextField
              error={errors.url && errors.url.length > 0}
              helperText={errors.url}
              label="url"
              name="url"
              type="text"
              variant="outlined"
              value={url}
              onChange={(e) => onChange && onChange(e)}
            />
            <FormHelperText>{t(`mediasHelpers.URL.${media}`)}</FormHelperText>
          </div>
          <div>
            <TextField
              error={errors.name && errors.name.length > 0}
              helperText={errors.name}
              label="nombre"
              name="name"
              type="text"
              variant="outlined"
              value={name}
              onChange={(e) => onChange && onChange(e)}
            />
            <FormHelperText>{t(`mediasHelpers.name.${media}`)}</FormHelperText>
          </div>
        </StyledInputsContainer>
      </Collapse>
    </Card>
  );
};

const StyledInputsContainer = styledComponents(CardContent)`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 1rem;
`;

export default MyMediasForm;
