import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Link,
} from '@material-ui/core';
import { BlogsLiterarios } from '../interfaces/blogsLiterarios';

interface Props {
  blog: BlogsLiterarios
}

const BlogLiterarioListItem: React.FC<Props> = ({ blog }: Props): JSX.Element => {
  const { nombre, descripcion, url } = blog;
  return (
    <Card>
      <CardContent>
        <h2>{nombre}</h2>
        <p>{descripcion}</p>
        <CardActions>
          <Link href={url} variant="body2">
            Visitar
          </Link>
        </CardActions>
      </CardContent>
    </Card>
  );
};


export default BlogLiterarioListItem;
