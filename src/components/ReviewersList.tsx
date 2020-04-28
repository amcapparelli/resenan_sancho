import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { Button } from '@material-ui/core';
import { ReviewerListItem, GenresSelector } from '.';
import { useReviewersListFetch, useFilters } from '../utils/customHooks';


const ReviewersList: React.FC = (): JSX.Element => {
  const [filters, setFilters] = useFilters({});
  const [state, listRequest] = useReviewersListFetch();
  useEffect(() => {
    listRequest();
  }, []);

  const filter = () => {
    listRequest(filters);
  };

  return (
    <div>
      <StyledFiltersContainer>
        <GenresSelector
          onChange={(
            { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
          ) => setFilters(name, value)}
          genreSelected={filters.genre}
          errors=""
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={filter}
        >
          Filtrar Listado
        </Button>
      </StyledFiltersContainer>
      <StyledList>
        {
          state.reviewers.map(
            // eslint-disable-next-line no-underscore-dangle
            (reviewer) => <li key={reviewer._id}><ReviewerListItem reviewer={reviewer} /></li>,
          )
        }
      </StyledList>
    </div>
  );
};

const StyledList = styledComponents.ul`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  list-style-type: none;
`;

const StyledFiltersContainer = styledComponents.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(4, 1fr);
  margin-left: 10%;
`;

export default ReviewersList;
