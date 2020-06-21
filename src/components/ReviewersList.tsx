import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
  ReviewerListItem,
  Loading,
  Filters,
  ListPagination,
} from '.';
import { useReviewersListFetch, useFilters } from '../utils/customHooks';

const ReviewersList: React.FC = (): JSX.Element => {
  const { t } = useTranslation();
  const [filters, setFilters] = useFilters({
    page: 1,
  });
  const [state, listRequest, loading] = useReviewersListFetch();
  useEffect(() => {
    listRequest(filters);
  }, [filters.page]);

  const filter = () => {
    listRequest({ ...filters, page: 1 });
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
        text={t('helpers.searchReviewers')}
        showInputSearch
      />
      <ListPagination
        onChange={(e: React.ChangeEvent<HTMLInputElement>, page: number) => setFilters('page', page)}
        totalPages={state.totalPages}
      />
      <StyledList>
        {
          loading
            ? <Loading />
            : state.reviewers.map(
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
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 375px) {
    grid-template-columns: 1fr;
  }
  grid-template-columns: repeat(3, 1fr);
  list-style-type: none;
`;

export default ReviewersList;
