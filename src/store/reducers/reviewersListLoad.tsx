interface ReviewersList {
  reviewers: Array<any>,
  totalElements: number,
  totalPages: number,
}

interface IAction {
  type: string,
  payload: {
    reviewers: Array<ReviewersList>,
    totalElements: number,
    totalPages: number,
  }
}

export default (state: ReviewersList, action: IAction) => {
  switch (action.type) {
    case 'REVIEWERS_LIST_LOAD': {
      const { reviewers, totalElements, totalPages } = action.payload;
      return {
        reviewers: [...reviewers],
        totalElements,
        totalPages,
      };
    }
    default: return state;
  }
};
