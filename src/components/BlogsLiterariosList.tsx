import React, { useEffect, useState } from 'react';
import styledComponents from 'styled-components';
import { blogsLiterarios as URL } from '../config/routes';
import { BlogsLiterarios } from '../interfaces/blogsLiterarios';
import { BlogLiterarioListItem } from '.';


const BlogsLiterariosList: React.FC = (): JSX.Element => {
  const [blogsLiterarios, setBlogsLiterarios] = useState<Array<BlogsLiterarios>>([]);
  useEffect(() => {
    async function fetchBlogsLiterariosList() {
      const token = sessionStorage.getItem('token');
      if (token) {
        const response = await fetch(`${URL}`, {
          method: 'get',
          headers: { 'Content-Type': 'application/json' },
        });
        const { blogs } = await response.json();
        setBlogsLiterarios(blogs);
      }
    }
    fetchBlogsLiterariosList();
  }, []);
  return (
    <div>
      <StyledList>
        {
          blogsLiterarios.map(
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
