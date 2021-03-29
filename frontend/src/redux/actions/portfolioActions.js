import portfolioConstants from "../constants/portfolioConstants";
import portfolioAPI from "../../api/portfolio";

const portfolioActions = {
  createPortfolioPending: () => ({
    type: portfolioConstants.CREATE_PORTFOLIO_PENDING,
  }),
  createPortfolioSuccess: () => ({
    type: portfolioConstants.CREATE_PORTFOLIO_SUCCESS,
  }),
  createPortfolioFailure: (error) => ({
    type: portfolioConstants.CREATE_PORTFOLIO_FAILURE,
    payload: error,
  }),
  createPortfolio: (payload) => async (dispatch) => {
    dispatch(portfolioActions.createPortfolioPending());
    try {
      const { newName } = payload;
      const { status, error } = await portfolioAPI.createPortfolio(newName);
      if (status === 200) {
        dispatch(portfolioActions.createPortfolioSuccess());
        dispatch(portfolioActions.getPortfolios());
      } else {
        dispatch(portfolioActions.createPortfolioFailure(error));
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
      const { status, data, error } = await portfolioAPI.getPortfolios();
      if (status === 200) {
        dispatch(portfolioActions.getPortfoliosSuccess(data));
      } else {
        dispatch(portfolioActions.getPortfoliosFailure(error));
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
      const { status, data, error } = await portfolioAPI.deletePortfolio(
        portfolioName
      );
      if (status === 200) {
        dispatch(portfolioActions.deletePortfolioSuccess(data));
        dispatch(portfolioActions.getPortfolios());
      } else {
        dispatch(portfolioActions.deletePortfolioFailure(error));
      }
    } catch (error) {
      dispatch(portfolioActions.deletePortfolioFailure(error));
    }
  },
  editPortfolioPending: () => ({
    type: portfolioConstants.EDIT_PORTFOLIO_PENDING,
  }),
  editPortfolioSuccess: (response) => ({
    type: portfolioConstants.EDIT_PORTFOLIO_SUCCESS,
    payload: response,
  }),
  editPortfolioFailure: (error) => ({
    type: portfolioConstants.EDIT_PORTFOLIO_FAILURE,
    payload: error,
  }),
  editPortfolio: (payload) => async (dispatch) => {
    const { oldName, newName } = payload;
    dispatch(portfolioActions.editPortfolioPending());
    try {
      const { status, message } = await portfolioAPI.editPortfolio(
        oldName,
        newName
      );
      if (status === 200) {
        dispatch(portfolioActions.editPortfolioSuccess({ oldName, newName }));
      } else {
        dispatch(portfolioActions.editPortfolioFailure(message));
      }
    } catch (error) {
      dispatch(portfolioActions.editPortfolioFailure(error));
    }
  },
};

export default portfolioActions;
