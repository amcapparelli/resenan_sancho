/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';
import styledComponents from 'styled-components';
import {
  Card,
  CardContent,
} from '@material-ui/core';
import { Book } from '../interfaces/books';

interface Props {
  book: Book
}

const BookListItem: React.FC<Props> = ({ book }: Props): JSX.Element => {
  const {
    title,
    author,
    cover,
    _id,
  } = book;
  return (
    <Card>
      <CardContent>
        <StyledCardContentContainer>
          <div>
            <h2>{title}</h2>
            <p>{`${author.name} ${author.lastName}`}</p>
            <Link href={{ pathname: '/books', query: { book: _id } }}>
              <a>leer más</a>
            </Link>
          </div>
          <StyledImageContainer src={cover} alt={`${title} cover`} />
        </StyledCardContentContainer>
      </CardContent>
    </Card>
  );
};

const StyledImageContainer = styledComponents.img`
  width: 90%;
  border:2px solid #fff;
  box-shadow: 10px 10px 5px #ccc;
`;

const StyledCardContentContainer = styledComponents.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
`;

export default BookListItem;
