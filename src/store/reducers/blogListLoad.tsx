import { BlogsLiterarios } from '../../interfaces/blogsLiterarios';

interface BlogsList {
  blogs: Array<BlogsLiterarios>
}

interface IAction {
  type: string,
  payload: BlogsList,
}

export default (state: BlogsList, action: IAction) => {
  switch (action.type) {
    case 'BLOG_LIST_LOAD': {
      const { blogs } = action.payload;
      return {
        blogs: [...state.blogs, ...blogs],
      };
    }
    default: return state;
  }
};
