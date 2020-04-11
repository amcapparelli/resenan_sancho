import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  FormControlLabel,
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
}

const MyMediasForm: React.FC<MyProps> = (props: MyProps): JSX.Element => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const { media, onChange } = props;
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.root}>
      <CardHeader
        title={media}
      />
      <CardMedia
        className={classes.media}
        image="/static/iconoreseñas.jpg"
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
          label={`Añadir mi ${media}`}
        />
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <TextField
            label="url"
            name="url"
            type="text"
            variant="outlined"
            onChange={(e) => onChange && onChange(e)}
          />
          <TextField
            label="nombre"
            name="name"
            type="text"
            variant="outlined"
            onChange={(e) => onChange && onChange(e)}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default MyMediasForm;
