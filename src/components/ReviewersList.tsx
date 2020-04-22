import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { ReviewerListItem } from '.';
import { useReviewersListFetch } from '../utils/customHooks';


const ReviewersList: React.FC = (): JSX.Element => {
  const [state, listRequest] = useReviewersListFetch();
  useEffect(() => {
    listRequest();
  }, []);

  return (
    <div>
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

export default ReviewersList;
