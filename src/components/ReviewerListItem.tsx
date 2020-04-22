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
import { Reviewer } from '../interfaces/reviewer';

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
  reviewer: Reviewer
}

const ReviewerListItem: React.FC<Props> = ({ reviewer }: Props): JSX.Element => {
  const classes = useStyles();
  const {
    name,
    lastName,
    avatar,
    country,
  } = reviewer.author;
  const { blog, bookstagram } = reviewer;

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar alt="avatar" src={avatar || '/static/default-avatar.png'} />
        }
        title={<Typography variant="h4">{`${name} ${lastName}`}</Typography>}
        subheader="September 14, 2019"
      />
      <CardContent>
        <Typography variant="body1" align="left">{country}</Typography>
        <CardActions>
          <Typography variant="subtitle2">Lee sus reseñas en:</Typography>
          {
            blog
            && (
              <Link href={blog.url} variant="body2">
                {blog.name}
              </Link>
            )
          }
          {
            bookstagram
            && (
              <Link href={bookstagram.url} variant="body2">
                {bookstagram.name}
              </Link>
            )
          }
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default ReviewerListItem;
