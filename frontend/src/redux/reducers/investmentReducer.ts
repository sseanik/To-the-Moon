import { Action } from "redux";
import { SimpleReduxState } from "../../types/generalTypes";
import investmentConstants from "../constants/investmentConstants";

const investmentReducer = (state = initialState, action: InvestmentAction) => {
  switch (action.type) {
    case investmentConstants.CREATE_STOCK_PENDING:
      return {
        ...state,
        createStock: {
          loading: true,
          error: "",
        },
      };
    case investmentConstants.CREATE_STOCK_SUCCESS:
      return {
        ...state,
        createStock: {
          loading: false,
          error: "",
        },
      };
    case investmentConstants.CREATE_STOCK_FAILURE:
      return {
        ...state,
        createStock: {
          loading: false,
          error: action.payload,
        },
      };
    case investmentConstants.GET_STOCKS_PENDING:
      const newLoadingPending = { ...state.getStocks.loading };
      newLoadingPending[action.payload.portfolio] = true;
      return {
        ...state,
        getStocks: {
          ...state.getStocks,
          loading: { ...newLoadingPending },
        },
      };
    case investmentConstants.GET_STOCKS_SUCCESS:
      const newLoadingSuccess = { ...state.getStocks.loading };
      newLoadingSuccess[action.payload.portfolio] = false;
      const newStocksSuccess = { ...state.getStocks.stocks };
      newStocksSuccess[action.payload.portfolio] = action.payload.response;
      return {
        ...state,
        getStocks: {
          ...state.getStocks,
          loading: { ...newLoadingSuccess },
          stocks: { ...newStocksSuccess },
        },
      };
    case investmentConstants.GET_STOCKS_FAILURE:
      const newLoadingFailure = { ...state.getStocks.loading };
      newLoadingFailure[action.payload.portfolio] = false;
      return {
        ...state,
        getStocks: {
          ...state.getStocks,
          loading: { ...newLoadingFailure },
          error: action.payload.error,
        },
      };
    case investmentConstants.DELETE_STOCK_PENDING:
      return {
        ...state,
        deleteStock: {
          error: "",
          deleting: [...state.deleteStock.deleting, action.payload],
        },
      };
    case investmentConstants.DELETE_STOCK_SUCCESS:
      return {
        ...state,
        deleteStock: {
          error: "",
          deleting: state.deleteStock.deleting.filter(
            (id) => id === action.payload
          ),
        },
      };
    case investmentConstants.DELETE_STOCK_FAILURE:
      return {
        ...state,
        deleteStock: {
          error: action.payload,
          deleting: [],
        },
      };
    default:
      return state;
  }
};

interface InvestmentAction extends Action {
  payload: any;
}

interface GetStocksState {
  loading: { [key: string]: boolean };
  stocks: { [key: string]: string[] };
  error: string;
}

interface InitialState {
  createStock: SimpleReduxState;
  getStocks: GetStocksState;
  deleteStock: MultipleDeleteState;
}

interface MultipleDeleteState {
  error: string;
  deleting: string[];
}

const initialState: InitialState = {
  createStock: {
    loading: false,
    error: "",
  },
  getStocks: {
    loading: {},
    stocks: {},
    error: "",
  },
  deleteStock: {
    error: "",
    deleting: [],
  },
};

export default investmentReducer;
