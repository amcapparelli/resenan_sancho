interface ReviewersList {
  reviewers: Array<any>
}

interface IAction {
  type: string,
  payload: ReviewersList,
}

export default (state: ReviewersList, action: IAction) => {
  switch (action.type) {
    case 'REVIEWERS_LIST_LOAD': {
      const { reviewers } = action.payload;
      return {
        reviewers: [...reviewers],
      };
    }
    default: return state;
  }
};
