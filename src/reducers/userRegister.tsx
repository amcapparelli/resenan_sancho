import { IUser } from '../interfaces/user';

interface IAction {
  type: string,
  payload: {
    name: string,
    value: string,
  },
}

export default (state: IUser, action: IAction) => {
  switch (action.type) {
    case 'USER_DATA': {
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value,
      };
    }
    default: return state;
  }
};
