import { Action } from "redux";
import { SimpleReduxState } from "../../types/generalTypes";
import portfolioConstants from "../constants/portfolioConstants";

const portfolioReducer = (state = initialState, action: PortfolioAction) => {
  switch (action.type) {
    case portfolioConstants.CREATE_PORTFOLIO_PENDING:
      return {
        ...state,
        createPortfolio: {
          loading: true,
          error: "",
        },
      };
    case portfolioConstants.CREATE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        createPortfolio: {
          loading: false,
          error: "",
        },
        getPortfolios: {
          loading: false,
          portfolios: [
            ...state.getPortfolios.portfolios,
            action.payload.newName,
          ],
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
      pendingLoadingState[action.payload.portfolio!] = true;
      const errorState = { ...state.getPortfolioPerf.error };
      delete errorState[action.payload.portfolio!];
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
      successLoadingState[action.payload.portfolio!] = false;
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
      failureLoadingState[action.payload.portfolio!] = false;
      return {
        ...state,
        getPortfolioPerf: {
          ...state.getPortfolioPerf,
          loading: { ...failureLoadingState },
          error: {
            ...state.getPortfolioPerf.error,
            ...action.payload.response,
          },
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_PENDING:
      return {
        ...state,
        deletePortfolio: {
          error: "",
          deleting: [...state.deletePortfolio.deleting, action.payload],
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        deletePortfolio: {
          error: "",
          deleting: state.deletePortfolio.deleting.filter(
            (name) => name !== action.payload.portfolioName
          ),
        },
        getPortfolios: {
          loading: false,
          portfolios: state.getPortfolios.portfolios.filter(
            (name) => name !== action.payload.portfolioName
          ),
        },
      };
    case portfolioConstants.DELETE_PORTFOLIO_FAILURE:
      return {
        ...state,
        deletePortfolio: {
          error: action.payload,
          deleting: [],
        },
      };
    case portfolioConstants.EDIT_PORTFOLIO_PENDING:
      return {
        ...state,
        editPortfolio: { loading: true, error: "" },
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

interface PortfolioAction extends Action {
  payload: {
    oldName?: string;
    newName?: string;
    portfolio?: string;
    portfolioName?: string;
    response?: GetPortfolioPerfResponse;
  };
}

interface GetPortfolioPerfResponse {
  [key: string]: {
    portfolio_change: number;
    investments: InvestmentInfo[];
  };
}

interface MultiplePortfolioState {
  loading: boolean;
  portfolios: string[];
}

interface MultipleDeleteState {
  error: string;
  deleting: string[];
}

interface EditPortfolioState extends SimpleReduxState {
  oldName: string;
  newName: string;
}

interface GetPortfolioPerfState {
  loading: {
    [portfolio_name: string]: boolean;
  };
  error: {
    [portfolio_name: string]: string;
  };
  data: {
    [portfolio_name: string]: {
      portfolio_change: string;
      investments: InvestmentInfo[];
    };
  };
}

interface InvestmentInfo {
  investment_id: string;
  purchase_price: string;
  num_shares: number;
  purchase_date: string;
  total_change: number;
  stock_ticker: string;
}

interface InitialState {
  createPortfolio: SimpleReduxState;
  editPortfolio: EditPortfolioState;
  getPortfolios: MultiplePortfolioState;
  getPortfolioPerf: GetPortfolioPerfState;
  deletePortfolio: MultipleDeleteState;
}

const initialState: InitialState = {
  createPortfolio: {
    loading: false,
    error: "",
  },
  getPortfolios: {
    loading: false,
    portfolios: [],
  },
  getPortfolioPerf: {
    loading: {}, // { <portfolio_name>: true, <portfolio_name>: false, ... }
    error: {}, // { <portfolio_name>: <error>, <portfolio_name>: <error>, ... }
    data: {}, // { <portfolio_name>: { portfolio_change: <string>, investments: [...] } , ... }
  },
  deletePortfolio: {
    error: "",
    deleting: [],
  },
  editPortfolio: {
    loading: false,
    error: "",
    oldName: "",
    newName: "",
  },
};

export default portfolioReducer;
