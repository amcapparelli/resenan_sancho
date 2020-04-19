import { useReducer } from 'react';
import { blogListLoad } from '../../store/reducers';
import { BlogsLiterarios } from '../../interfaces/blogsLiterarios';
import { blogsLiterarios as URL } from '../../config/routes';

interface State {
  blogs: Array<BlogsLiterarios>;
}
const initialState: State = {
  blogs: [],
};

const useBlogsListFetch = (): [State, Function] => {
  const [state, dispatch] = useReducer(blogListLoad, initialState);
  const listRequest = async (): Promise<void> => {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(URL, options);
      const blogs = await response.json();
      dispatch({
        type: 'BLOG_LIST_LOAD',
        payload: blogs,
      });
    } catch (error) {
      dispatch({ type: 'BLOG_LIST_ERROR', payload: error });
    }
  };
  return [state, listRequest];
};

export default useBlogsListFetch;
