import stockConstants from "../constants/stockConstants";

const initialState = {
  createStockForm: {
    values: {
      portfolioName: "",
      stockName: "",
    },
    errors: {
      portfolioName: "",
      stockName: "",
    },
  },
};

const validateCreateStock = (payload) => {
  const { stockName } = payload;
  const errors = {
    stockName: "",
  };

  if (!stockName && stockName.length === 0) {
    errors.stockName = "Stock name is required";
  } else if (stockName.length < 3) {
    errors.stockName = "Stock name must be at least 3 characters";
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
