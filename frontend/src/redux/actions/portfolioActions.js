import portfolioConstants from "../constants/portfolioConstants";
import portfolioAPI from "../../api/portfolioAPI";

const portfolioActions = {
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
  createPortfolio: (payload) => async (dispatch) => {
    dispatch(portfolioActions.createPortfolioPending());
    try {
      const { newName } = payload;
      const res = await portfolioAPI.createPortfolio(newName);
      if (res.status === 200) {
        dispatch(portfolioActions.createPortfolioSuccess(res));
        dispatch(portfolioActions.getPortfolios());
      } else {
        dispatch(portfolioActions.createPortfolioFailure(res.error));
      }
    } catch (error) {
      dispatch(portfolioActions.createPortfolioFailure(error));
    }
  },
  getPortfoliosPending: () => ({
    type: portfolioConstants.GET_PORTFOLIOS_PENDING,
  }),
  getPortfoliosSuccess: (response) => ({
    type: portfolioConstants.GET_PORTFOLIOS_SUCCESS,
    payload: response,
  }),
  getPortfoliosFailure: (error) => ({
    type: portfolioConstants.GET_PORTFOLIOS_FAILURE,
    payload: error,
  }),
  getPortfolios: () => async (dispatch) => {
    dispatch(portfolioActions.getPortfoliosPending());
    try {
      const res = await portfolioAPI.getPortfolios();
      if (res.status === 200) {
        dispatch(portfolioActions.getPortfoliosSuccess(res));
      } else {
        dispatch(portfolioActions.getPortfoliosFailure(res.error));
      }
    } catch (error) {
      dispatch(portfolioActions.getPortfoliosFailure(error));
    }
  },
  deletePortfolioPending: (portfolioName) => ({
    type: portfolioConstants.DELETE_PORTFOLIO_PENDING,
    payload: portfolioName,
  }),
  deletePortfolioSuccess: (response) => ({
    type: portfolioConstants.DELETE_PORTFOLIO_SUCCESS,
    payload: response,
  }),
  deletePortfolioFailure: (error) => ({
    type: portfolioConstants.DELETE_PORTFOLIO_FAILURE,
    payload: error,
  }),
  deletePortfolios: (payload) => async (dispatch) => {
    const { portfolioName } = payload;
    dispatch(portfolioActions.deletePortfolioPending(portfolioName));
    try {
      const res = await portfolioAPI.deletePortfolio(portfolioName);
      if (res.status === 200) {
        dispatch(portfolioActions.deletePortfolioSuccess(res));
        dispatch(portfolioActions.getPortfolios());
      } else {
        dispatch(portfolioActions.deletePortfolioFailure(res));
      }
    } catch (error) {
      dispatch(portfolioActions.deletePortfolioFailure(error));
    }
  },
};

export default portfolioActions;
