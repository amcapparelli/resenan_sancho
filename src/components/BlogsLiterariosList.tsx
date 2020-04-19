import React, { useEffect } from 'react';
import styledComponents from 'styled-components';
import { BlogLiterarioListItem } from '.';
import { useBlogsListFetch } from '../utils/customHooks';


const BlogsLiterariosList: React.FC = (): JSX.Element => {
  const [state, listRequest] = useBlogsListFetch();
  useEffect(() => {
    listRequest();
  }, []);

  return (
    <div>
      <StyledList>
        {
          state.blogs.map(
            // eslint-disable-next-line no-underscore-dangle
            (blog) => <li key={blog._id}><BlogLiterarioListItem blog={blog} /></li>,
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

export default BlogsLiterariosList;
