import portfolioConstants from "../constants/portfolioConstants";

const initialState = {
  createPortfolioForm: {
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

const validateCreatePortfolio = (payload) => {
  const { name } = payload;
  const errors = {
    name: "",
    userID: "",
  };

  if (!name && name.length === 0) {
    errors.name = "Name is required";
  } else if (name.length > 30) {
    errors.name = "Name must be less than 30 characters";
  }

  return errors;
};

const submitCreatePortfolioForm = (state = initialState, action) => {
  switch (action.type) {
    case portfolioConstants.SUBMIT_CREATE_PORTFOLIO_FORM:
      const { payload } = action;
      return {
        ...state,
        createPortfolioForm: {
          values: payload,
          errors: validateCreatePortfolio(payload),
        },
      };
    default:
      return state;
  }
};

export default submitCreatePortfolioForm;
