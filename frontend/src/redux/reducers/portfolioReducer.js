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
  getPortfolioPerf: {
    loading: false,
    error: {},
    data: {},
  },
  deletePortfolio: {
    loading: false,
    error: null,
    deleting: [],
  },
  editPortfolio: {
    loading: false,
    error: null,
    oldName: null,
    newName: null,
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
          portfolios: action.payload,
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
    case portfolioConstants.GET_PORTFOLIO_PERF_PENDING:
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: true,
          error: {},
        },
      };
    case portfolioConstants.GET_PORTFOLIO_PERF_SUCCESS:
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: false,
          data: action.payload,
        },
      };
    case portfolioConstants.GET_PORTFOLIO_PERF_FAILURE:
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: false,
          error: action.payload,
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_PENDING:
      return {
        ...state,
        deletePortfolio: {
          loading: true,
          error: null,
          deleting: [...state.deletePortfolio.deleting, action.payload],
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        deletePortfolio: {
          loading: false,
          error: null,
          deleting: state.deletePortfolio.deleting.filter(
            (name) => name === action.payload
          ),
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_FAILURE:
      return {
        ...state,
        deletePortfolio: {
          loading: false,
          error: action.payload.error,
          deleting: [],
        },
      };
    case portfolioConstants.EDIT_PORTFOLIO_PENDING:
      return {
        ...state,
        editPortfolio: { loading: true, error: null },
      };
    case portfolioConstants.EDIT_PORTFOLIO_SUCCESS:
      return {
        ...state,
        editPortfolio: {
          loading: false,
          oldName: action.payload.oldName,
          newName: action.payload.newName,
        },
      };
    case portfolioConstants.EDIT_PORTFOLIO_FAILURE:
      return {
        ...state,
        editPortfolio: {
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default portfolioReducer;
