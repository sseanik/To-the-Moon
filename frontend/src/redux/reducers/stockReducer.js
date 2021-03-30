import stockConstants from "../constants/stockConstants";

const initialState = {
  basic: {
    loading: false,
    error: null,
    data: {
      data: {},
      data_intraday: {},
      summary: {},
      fundamentals: {},
    },
  },
  income: {
    loading: false,
    error: null,
    data: []
  },
  balance: {
    loading: false,
    error: null,
    data: []
  },
  cashFlow: {
    loading: false,
    error: null,
    data: []
  },
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    // Basic
    case stockConstants.GET_STOCK_BASIC_PENDING:
      return {
        ...state,
        basic: {
          ...state.basic,
          loading: true,
          error: null,
        },
      };
    case stockConstants.GET_STOCK_BASIC_SUCCESS:
      return {
        ...state,
        basic: {
          ...state.basic,
          loading: false,
          error: null,
          data: action.payload.data
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
          error: null,
        },
      };
    case stockConstants.GET_STOCK_INCOME_SUCCESS:
      return {
        ...state,
        income: {
          ...state.income,
          loading: false,
          error: null,
          data: action.payload.data
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
          error: null,
        },
      };
    case stockConstants.GET_STOCK_BALANCE_SUCCESS:
      return {
        ...state,
        balance: {
          ...state.balance,
          loading: false,
          error: null,
          data: action.payload.data
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
          error: null,
        },
      };
    case stockConstants.GET_STOCK_CASHFLOW_SUCCESS:
      return {
        ...state,
        cashFlow: {
          ...state.cashFlow,
          loading: false,
          error: null,
          data: action.payload.data
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
    default:
      return state;
  }
};

export default stockReducer;