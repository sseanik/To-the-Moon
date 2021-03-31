import investmentConstants from "../constants/investmentConstants";

const initialState = {
  createStock: {
    loading: false,
    error: null,
  },
  getStocks: {
    loading: false,
    stocks: [],
  },
  deleteStock: {
    loading: false,
    error: null,
    deleting: [],
  },
};

const investmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case investmentConstants.CREATE_STOCK_PENDING:
      return {
        ...state,
        createStock: {
          loading: true,
          error: null,
        },
      };
    case investmentConstants.CREATE_STOCK_SUCCESS:
      return {
        ...state,
        createStock: {
          loading: false,
          error: null,
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
          loading: true,
          error: null,
          deleting: [...state.deleteStock.deleting, action.payload],
        },
      };
    case investmentConstants.DELETE_STOCK_SUCCESS:
      return {
        ...state,
        deleteStock: {
          loading: false,
          error: null,
          deleting: state.deleteStock.deleting.filter(
            (id) => id === action.payload
          ),
        },
      };
    case investmentConstants.DELETE_STOCK_FAILURE:
      return {
        ...state,
        deleteStock: {
          loading: false,
          error: action.payload.error,
          deleting: state.deleteStock.deleting.filter(
            (id) => id === action.payload
          ),
        },
      };
    default:
      return state;
  }
};

export default investmentReducer;
