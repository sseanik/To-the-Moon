import stockConstants from "../constants/investmentConstants";

const initialState = {
  createStock: {
    loading: false,
    error: null,
  },
};

const createStock = (state = initialState, action) => {
  switch (action.type) {
    case stockConstants.CREATE_STOCK_PENDING:
      return {
        ...state,
        createStock: {
          ...state.createStock,
          loading: true,
        },
      };
    case stockConstants.CREATE_STOCK_SUCCESS:
      return {
        ...state,
        createStock: {
          ...state.createStock,
          loading: false,
          error: null,
        },
      };
    case stockConstants.CREATE_STOCK_FAILURE:
      return {
        ...state,
        createStock: {
          ...state.createStock,
          loading: false,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};

export default createStock;
