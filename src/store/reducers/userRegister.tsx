import { UserRegister } from '../../interfaces/user';

interface IAction {
  type: string,
  payload: {
    user: object,
  },
}

export default (state: UserRegister, action: IAction) => {
  switch (action.type) {
    case 'USER_LOGGIN': {
      const { user } = action.payload;
      return {
        ...state,
        ...user,
      };
    }
    default: return state;
  }
};
