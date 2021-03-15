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
        const { name, userID } = payload;
        const res = await portfolioAPI.createPortfolio(name, userID);
        setTimeout(() => {
          dispatch(portfolioActions.createPortfolioSuccess(res));
        }, 2500);

        const { token } = res;
        window.localStorage.setItem("Token", token);
      } catch (error) {
        setTimeout(() => {
          dispatch(portfolioActions.createPortfolioFailure(error));
        }, 2500);
      }
    };
  },
};

export default portfolioActions;
