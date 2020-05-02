/* eslint-disable no-nested-ternary */
import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { useBooksListFetch, useFilters } from '../utils/customHooks';
import {
  BookListItem,
  Loading,
  Filters,
  EmptyList,
  ListPagination,
} from '.';

const BooksList = () => {
  const [filters, setFilters] = useFilters({
    page: 1,
  });
  const [state, listRequest, loading] = useBooksListFetch();

  useEffect(() => {
    listRequest(filters);
  }, [filters.page]);

  const filter = () => {
    listRequest(filters);
  };

  return (
    <div>
      <Filters
        onChange={(
          { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
        ) => setFilters(name, value)}
        onClick={() => filter()}
        genreSelected={filters.genre}
        formatSelected={filters.format}
        text="Busca libros según tus preferencias: "
      />
      <ListPagination
        onChange={(e: React.ChangeEvent<HTMLInputElement>, page: number) => setFilters('page', page)}
        totalPages={state.totalPages}
      />
      <StyledList>
        {
          loading
            ? <Loading />
            : (
              state.books.length === 0
                ? <EmptyList />
                : state.books.map(
                  // eslint-disable-next-line no-underscore-dangle
                  (book) => <li key={book._id}><BookListItem book={book} /></li>,
                )
            )
        }
      </StyledList>
    </div>
  );
};

const StyledList = styledComponents.ul`
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
`;

export default BooksList;
