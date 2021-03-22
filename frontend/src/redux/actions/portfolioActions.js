import portfolioConstants from "../constants/portfolioConstants";
import portfolioAPI from "../../api/portfolioAPI";

const portfolioActions = {
  submitCreatePortfolioForm: (user) => ({
    type: portfolioConstants.SUBMIT_CREATE_PORTFOLIO_FORM,
    payload: user,
  }),
  createPortfolioPending: () => ({
    type: portfolioConstants.CREATE_PORTFOLIO_PENDING,
  }),
  createPortfolioSuccess: (response) => ({
    type: portfolioConstants.CREATE_PORTFOLIO_SUCCESS,
    payload: response,
  }),
  createPortfolioFailure: (error) => ({
    type: portfolioConstants.CREATE_PORTFOLIO_FAILURE,
    payload: error,
  }),
  createPortfolio: (payload) => {
    return async (dispatch) => {
      dispatch(portfolioActions.createPortfolioPending());
      try {
        const { name } = payload;
        const res = await portfolioAPI.createPortfolio(name);
        if (res.status === 200) {
          dispatch(portfolioActions.createPortfolioSuccess(res));
        } else {
          dispatch(portfolioActions.createPortfolioFailure(res.error));
        }
      } catch (error) {
        dispatch(portfolioActions.createPortfolioFailure(error));
      }
    };
  },
};

export default portfolioActions;
