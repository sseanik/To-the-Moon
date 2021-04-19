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
    loading: {},    // { <portfolio_name>: true, <portfolio_name>: false, ... }
    error: {},      // { <portfolio_name>: <error>, <portfolio_name>: <error>, ... }
    data: {},       // { <portfolio_name>: { portfolio_change: <string>, investments: [...] } , ... }
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
      const pendingLoadingState = { ...state.getPortfolioPerf.loading };
      pendingLoadingState[action.payload.portfolio] = true;
      const errorState = { ...state.getPortfolioPerf.error };
      delete errorState[action.payload.portfolio];
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: { ...pendingLoadingState },
          error: { ...errorState },
        },
      };
    case portfolioConstants.GET_PORTFOLIO_PERF_SUCCESS:
      const successLoadingState = { ...state.getPortfolioPerf.loading };
      successLoadingState[action.payload.portfolio] = false;
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: { ...successLoadingState },
          data: { ...state.getPortfolioPerf.data, ...action.payload.response },
        },
      };
    case portfolioConstants.GET_PORTFOLIO_PERF_FAILURE:
      const failureLoadingState = { ...state.getPortfolioPerf.loading };
      failureLoadingState[action.payload.portfolio] = false;
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: { ...failureLoadingState },
          error: { ...state.getPortfolioPerf.error, ...action.payload.response },
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
