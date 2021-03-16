import stockConstants from "../constants/stockConstants";

const initialState = {
  createStockForm: {
    values: {
      name: "",
      userID: "",
    },
    errors: {
      name: "",
      userID: "",
    },
  },
};

const validateCreateStock = (payload) => {
  const { stockName } = payload;
  const errors = {
    stockName: "",
    userID: "",
  };

  if (!stockName && stockName.length === 0) {
    errors.stockName = "Stock name is required";
  }

  return errors;
};

const submitCreateStockForm = (state = initialState, action) => {
  switch (action.type) {
    case stockConstants.SUBMIT_CREATE_STOCK_FORM:
      const { payload } = action;
      return {
        ...state,
        createStockForm: {
          values: payload,
          errors: validateCreateStock(payload),
        },
      };
    default:
      return state;
  }
};

export default submitCreateStockForm;
