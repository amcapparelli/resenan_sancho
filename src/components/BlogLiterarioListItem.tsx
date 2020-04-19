import React from 'react';
import styledComponents from 'styled-components';
import {
  makeStyles,
  Theme,
  createStyles,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Link,
  Typography,
} from '@material-ui/core';
import { BlogsLiterarios } from '../interfaces/blogsLiterarios';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    maxWidth: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));

interface Props {
  blog: BlogsLiterarios
}

const BlogLiterarioListItem: React.FC<Props> = ({ blog }: Props): JSX.Element => {
  const classes = useStyles();
  const { nombre, descripcion, url } = blog;
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar alt="avatar" src="/static/default-avatar.png" />
        }
        title={<Typography variant="h4">{nombre}</Typography>}
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body1" align="left">{descripcion}</Typography>
        <CardActions>
          <Typography variant="subtitle2">Lee sus reseñas en:</Typography>
          <Link href={url} variant="body2">
            Visitar
          </Link>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default BlogLiterarioListItem;
