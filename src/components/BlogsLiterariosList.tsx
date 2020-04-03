import React, { useEffect, useReducer } from 'react';
import styledComponents from 'styled-components';
import { blogsLiterarios as URL } from '../config/routes';
import { BlogsLiterarios } from '../interfaces/blogsLiterarios';
import { BlogLiterarioListItem } from '.';
import { blogListLoad } from '../store/reducers';


const BlogsLiterariosList: React.FC = (): JSX.Element => {
  interface State {
    blogs: Array<BlogsLiterarios>;
  }
  const initialState: State = {
    blogs: [],
  };
  const [state, dispatch] = useReducer(blogListLoad, initialState);
  useEffect(() => {
    async function fetchBlogsLiterariosList() {
      try {
        const response = await fetch(`${URL}`, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        });
        const blogs = await response.json();
        dispatch({
          type: 'BLOG_LIST_LOAD',
          payload: blogs,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchBlogsLiterariosList();
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
  list-style-type: none;
`;

export default BlogsLiterariosList;
