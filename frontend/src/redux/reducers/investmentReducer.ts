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
      return {
        ...state,
        getStocks: {
          loading: true,
          stocks: [],
        },
      };
    case investmentConstants.GET_STOCKS_SUCCESS:
      return {
        ...state,
        getStocks: {
          loading: false,
          stocks: action.payload,
        },
      };
    case investmentConstants.GET_STOCKS_FAILURE:
      return {
        ...state,
        getStocks: {
          loading: false,
          stocks: [],
          error: action.payload,
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
  loading: boolean;
  stocks: string[];
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
    loading: false,
    stocks: [],
  },
  deleteStock: {
    error: "",
    deleting: [],
  },
};

export default investmentReducer;
