import portfolioConstants from "../constants/portfolioConstants";

const initialState = {
  createPortfolio: {
    loading: false,
    error: null,
  },
  getPortfolios: {
    loading: false,
    portfolios: [],
  },
  deletePortfolio: {
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
    case portfolioConstants.GET_PORTFOLIOS_PENDING:
      return {
        ...state,
        getPortfolios: {
          loading: true,
          portfolios: [],
        },
      };
    case portfolioConstants.GET_PORTFOLIOS_SUCCESS:
      return {
        ...state,
        getPortfolios: {
          loading: false,
          portfolios: action.payload.data,
        },
      };
    case portfolioConstants.GET_PORTFOLIOS_FAILURE:
      return {
        ...state,
        getPortfolios: {
          loading: false,
          portfolios: [],
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_PENDING:
      return {
        ...state,
        deletePortfolio: {
          loading: true,
          error: null,
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        deletePortfolio: {
          loading: false,
          error: null,
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_FAILURE:
      return {
        ...state,
        deletePortfolio: {
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default portfolioReducer;
