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
      await portfolioAPI.createPortfolio(newName);
      dispatch(portfolioActions.createPortfolioSuccess());
      dispatch(portfolioActions.getPortfolios());
    } catch (error) {
      dispatch(portfolioActions.createPortfolioFailure(error.error));
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
      const { data } = await portfolioAPI.getPortfolios();
      dispatch(portfolioActions.getPortfoliosSuccess(data));
    } catch (error) {
      dispatch(portfolioActions.getPortfoliosFailure(error.error));
    }
  },
  getPortfolioPerfPending: () => ({
    type: portfolioConstants.GET_PORTFOLIO_PERF_PENDING,
  }),
  getPortfolioPerfSuccess: (response) => ({
    type: portfolioConstants.GET_PORTFOLIO_PERF_SUCCESS,
    payload: response,
  }),
  getPortfolioPerfFailure: (error) => ({
    type: portfolioConstants.GET_PORTFOLIO_PERF_SUCCESS,
    payload: error,
  }),
  getPortfolioPerf: (payload) => async (dispatch) => {
    const { names } = payload;
    dispatch(portfolioActions.getPortfolioPerfPending());
    try {
      const promises = names.map((name) =>
        portfolioAPI.getPortfolioPerformance(name)
      );
      const responses = await Promise.all(promises);
      const perfData = {};
      const perfErrors = {};
      for (const { status, data, portfolio, error } of responses) {
        if (status !== 200) {
          perfErrors[portfolio] = { error };
          perfData[portfolio] = { error };
        } else {
          perfData[portfolio] = data;
        }
      }
      dispatch(portfolioActions.getPortfolioPerfFailure(perfErrors));
      dispatch(portfolioActions.getPortfolioPerfSuccess(perfData));
    } catch (error) {
      dispatch(portfolioActions.getPortfolioPerfFailure(error.message));
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
      const { data } = await portfolioAPI.deletePortfolio(portfolioName);
      dispatch(portfolioActions.deletePortfolioSuccess(data));
      dispatch(portfolioActions.getPortfolios());
    } catch (error) {
      dispatch(portfolioActions.deletePortfolioFailure(error.error));
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
      await portfolioAPI.editPortfolio(oldName, newName);
      dispatch(portfolioActions.editPortfolioSuccess({ oldName, newName }));
    } catch (error) {
      dispatch(portfolioActions.editPortfolioFailure(error.message));
    }
  },
};

export default portfolioActions;
