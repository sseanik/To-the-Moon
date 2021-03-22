import portfolioConstants from "../constants/portfolioConstants";

const initialState = {
  createPortfolio: {
    loading: false,
    error: null,
  },
};

const portfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case portfolioConstants.CREATE_PORTFOLIO_PENDING:
      return {
        ...state,
        createPortfolio: {
          loading: true,
          error: null,
        },
      };
    case portfolioConstants.CREATE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        createPortfolio: {
          loading: false,
          error: null,
        },
      };
    case portfolioConstants.CREATE_PORTFOLIO_FAILURE:
      return {
        ...state,
        createPortfolio: {
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default portfolioReducer;
