import { Action } from "redux";
import { SimpleReduxState } from "../../types/generalTypes";
import stockConstants from "../constants/stockConstants";

const stockReducer = (state = initialState, action: StockAction) => {
  switch (action.type) {
    // Basic
    case stockConstants.GET_STOCK_BASIC_PENDING:
      return {
        ...state,
        basic: {
          ...state.basic,
          loading: true,
          error: "",
        },
      };
    case stockConstants.GET_STOCK_BASIC_SUCCESS:
      return {
        ...state,
        basic: {
          ...state.basic,
          loading: false,
          error: "",
          data: action.payload.data,
        },
      };
    case stockConstants.GET_STOCK_BASIC_FAILURE:
      return {
        ...state,
        basic: {
          ...state.basic,
          loading: false,
          error: action.payload,
        },
      };
    // Income
    case stockConstants.GET_STOCK_INCOME_PENDING:
      return {
        ...state,
        income: {
          ...state.income,
          loading: true,
          error: "",
        },
      };
    case stockConstants.GET_STOCK_INCOME_SUCCESS:
      return {
        ...state,
        income: {
          ...state.income,
          loading: false,
          error: "",
          data: action.payload.data,
        },
      };
    case stockConstants.GET_STOCK_INCOME_FAILURE:
      return {
        ...state,
        income: {
          ...state.income,
          loading: false,
          error: action.payload,
        },
      };
    // Balance
    case stockConstants.GET_STOCK_BALANCE_PENDING:
      return {
        ...state,
        balance: {
          ...state.balance,
          loading: true,
          error: "",
        },
      };
    case stockConstants.GET_STOCK_BALANCE_SUCCESS:
      return {
        ...state,
        balance: {
          ...state.balance,
          loading: false,
          error: "",
          data: action.payload.data,
        },
      };
    case stockConstants.GET_STOCK_BALANCE_FAILURE:
      return {
        ...state,
        balance: {
          ...state.balance,
          loading: false,
          error: action.payload,
        },
      };
    // Balance
    case stockConstants.GET_STOCK_CASHFLOW_PENDING:
      return {
        ...state,
        cashFlow: {
          ...state.cashFlow,
          loading: true,
          error: "",
        },
      };
    case stockConstants.GET_STOCK_CASHFLOW_SUCCESS:
      return {
        ...state,
        cashFlow: {
          ...state.cashFlow,
          loading: false,
          error: "",
          data: action.payload.data,
        },
      };
    case stockConstants.GET_STOCK_CASHFLOW_FAILURE:
      return {
        ...state,
        cashFlow: {
          ...state.cashFlow,
          loading: false,
          error: action.payload,
        },
      };
    // Prediction - Daily
    case stockConstants.GET_PREDICTION_DAILY_PENDING:
      return {
        ...state,
        predictionDaily: {
          ...state.predictionDaily,
          loading: true,
          error: "",
        },
      };
    case stockConstants.GET_PREDICTION_DAILY_SUCCESS:
      return {
        ...state,
        predictionDaily: {
          ...state.predictionDaily,
          loading: false,
          error: "",
          data: action.payload.data,
        },
      };
    case stockConstants.GET_PREDICTION_DAILY_FAILURE:
      return {
        ...state,
        predictionDaily: {
          ...state.predictionDaily,
          loading: false,
          error: action.payload,
        },
      };
    case stockConstants.GET_PAPER_TRADING_PENDING:
      return {
        ...state,
        paperTradingResults: {
          ...state.paperTradingResults,
          loading: true,
          error: null,
        },
      };
    case stockConstants.GET_PAPER_TRADING_SUCCESS:
      return {
        ...state,
        paperTradingResults: {
          ...state.paperTradingResults,
          loading: false,
          error: null,
          data: action.payload.data,
        },
      };
    case stockConstants.GET_PAPER_TRADING_FAILURE:
      return {
        ...state,
        paperTradingResults: {
          ...state.paperTradingResults,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

interface StockAction extends Action {
  payload: {
    data?: any;
  };
}

interface BasicState extends SimpleReduxState {
  data: {
    data: Object;
    data_intraday: Object;
    summary: Object;
    fundamentals: Object;
  };
}

interface DataState extends SimpleReduxState {
  data: any[];
}

interface ObjectDataState extends SimpleReduxState {
  data: Object;
}

interface InitialState {
  basic: BasicState;
  income: DataState;
  balance: DataState;
  cashFlow: DataState;
  predictionDaily: ObjectDataState;
  paperTradingResults: ObjectDataState;
}

const initialState: InitialState = {
  basic: {
    loading: false,
    error: "",
    data: {
      data: {},
      data_intraday: {},
      summary: {},
      fundamentals: {},
    },
  },
  income: {
    loading: false,
    error: "",
    data: [],
  },
  balance: {
    loading: false,
    error: "",
    data: [],
  },
  cashFlow: {
    loading: false,
    error: "",
    data: [],
  },
  predictionDaily: {
    loading: false,
    error: "",
    data: {},
  },
  paperTradingResults: {
    loading: false,
    error: "",
    data: {},
  },
};

export default stockReducer;
