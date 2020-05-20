import React from 'react';
import { useTranslation } from 'react-i18next';
import styledComponents from 'styled-components';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  createStyles,
  makeStyles,
  Link,
  Typography,
} from '@material-ui/core';
import { Reviewer } from '../interfaces/reviewer';

const useStyles = makeStyles(() => createStyles({
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
  const { t } = useTranslation();
  const {
    description,
    formats,
    genres,
    blog,
    bookstagram,
    booktube,
    amazon,
    goodreads,
  } = reviewer;
  const {
    name,
    lastName,
    avatar,
    country,
  } = reviewer.author;

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar alt="avatar" src={avatar || '/static/default-avatar.png'} />
        }
        title={<Typography variant="h4">{`${name} ${lastName || ''}`}</Typography>}
        subheader={country}
      />
      <CardContent>
        <Typography variant="body1" align="left">{description}</Typography>
        <CardContent>
          <Typography align="center" variant="body1">Mira sus reseñas en:</Typography>
          <StyledChipsContainer>
            {
              blog && blog.url.length > 0
              && (
                <Link href={blog.url} target="_blank" rel="noopener noreferrer">
                  <StyledChip
                    color="primary"
                    avatar={<Avatar alt="literary blog" src="/static/iconoreseñas.jpg" />}
                    label={blog.name}
                  />
                </Link>
              )
            }
            {
              booktube && booktube.url.length > 0
              && (
                <Link href={booktube.url} target="_blank" rel="noopener noreferrer">
                  <StyledChip
                    color="primary"
                    avatar={<Avatar alt="booktube" src="/static/iconoyoutube.jpg" />}
                    label={booktube.name}
                  />
                </Link>
              )
            }
            {
              bookstagram && bookstagram.url.length > 0
              && (
                <Link href={bookstagram.url} target="_blank" rel="noopener noreferrer">
                  <StyledChip
                    color="primary"
                    avatar={<Avatar alt="bookstagram" src="/static/iconoinstagram.jpg" />}
                    label={bookstagram.name}
                  />
                </Link>
              )
            }
            {
              goodreads && goodreads.url.length > 0
              && (
                <Link href={goodreads.url} target="_blank" rel="noopener noreferrer">
                  <StyledChip
                    color="primary"
                    avatar={<Avatar alt="goodreads profile" src="/static/iconogoodreads.png" />}
                    label={goodreads.name}
                  />
                </Link>
              )
            }
            {
              amazon && amazon.url.length > 0
              && (
                <Link href={amazon.url} target="_blank" rel="noopener noreferrer">
                  <StyledChip
                    color="primary"
                    avatar={<Avatar alt="amazon profile" src="/static/iconoamazon.png" />}
                    label={amazon.name}
                  />
                </Link>
              )
            }
          </StyledChipsContainer>
        </CardContent>
        <CardContent>
          <Typography align="center" variant="body1">Sus géneros literarios preferidos:</Typography>
          <StyledChipsGenresContainer>
            {
              genres.map((genre) => (
                <Chip
                  size="small"
                  label={t(`genres.${genre}`)}
                  color="primary"
                />
              ))
            }
          </StyledChipsGenresContainer>
        </CardContent>
        <CardContent>
          <Typography align="center" variant="body1">Sus formatos de lectura:</Typography>
          <StyledChipsFormatsContainer>
            {
              formats.map((format) => (
                <Chip
                  size="small"
                  label={format}
                  color="secondary"
                />
              ))
            }
          </StyledChipsFormatsContainer>
        </CardContent>
      </CardContent>
    </Card>
  );
};

const StyledChip = styledComponents(Chip)`
  :hover{
    cursor: pointer;
    background-color: ${(props) => props.theme.dark};
    color: ${(props) => props.theme.main};
  }
`;

const StyledChipsContainer = styledComponents.div`
  justify-content: center;
  display: grid;
  grid-gap: .5rem;
  grid-template-columns: repeat(1, auto);
`;

const StyledChipsGenresContainer = styledComponents.div`
  justify-content: center;
  display: grid;
  grid-gap: .5rem;
  grid-template-columns: repeat(3, auto);
`;

const StyledChipsFormatsContainer = styledComponents.div`
  justify-content: center;
  display: grid;
  grid-gap: .5rem;
  grid-template-columns: repeat(4, auto);
`;

export default ReviewerListItem;
