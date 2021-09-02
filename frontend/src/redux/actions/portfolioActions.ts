import portfolioConstants from "../constants/portfolioConstants";
import portfolioAPI from "../../api/portfolio";
import { Dispatch } from "redux";
import noteActions from "./noteActions";

const portfolioActions = {
  createPortfolioPending: () => ({
    type: portfolioConstants.CREATE_PORTFOLIO_PENDING,
  }),
  createPortfolioSuccess: (response: CreatePortfolioPayload) => ({
    type: portfolioConstants.CREATE_PORTFOLIO_SUCCESS,
    payload: response,
  }),
  createPortfolioFailure: (error: string) => ({
    type: portfolioConstants.CREATE_PORTFOLIO_FAILURE,
    payload: error,
  }),
  createPortfolio: (payload: CreatePortfolioPayload) => async (
    dispatch: Dispatch
  ) => {
    dispatch(portfolioActions.createPortfolioPending());
    try {
      const { newName } = payload;
      await portfolioAPI.createPortfolio(newName);
      dispatch(portfolioActions.createPortfolioSuccess(payload));
    } catch (error: any) {
      dispatch(portfolioActions.createPortfolioFailure(error.message));
    }
  },
  getPortfoliosPending: () => ({
    type: portfolioConstants.GET_PORTFOLIOS_PENDING,
  }),
  getPortfoliosSuccess: (response: GetPortfoliosResponse) => ({
    type: portfolioConstants.GET_PORTFOLIOS_SUCCESS,
    payload: response,
  }),
  getPortfoliosFailure: (error: string) => ({
    type: portfolioConstants.GET_PORTFOLIOS_FAILURE,
    payload: error,
  }),
  getPortfolios: (): any => async (dispatch: Dispatch) => {
    dispatch(portfolioActions.getPortfoliosPending());
    try {
      const { data } = await portfolioAPI.getPortfolios();
      dispatch(portfolioActions.getPortfoliosSuccess(data));
    } catch (error: any) {
      dispatch(portfolioActions.getPortfoliosFailure(error.message));
    }
  },
  getPortfolioPerfPending: (portfolio: string) => ({
    type: portfolioConstants.GET_PORTFOLIO_PERF_PENDING,
    payload: { portfolio },
  }),
  getPortfolioPerfSuccess: (
    portfolio: string,
    response: GetPortfolioPerfResponse
  ) => ({
    type: portfolioConstants.GET_PORTFOLIO_PERF_SUCCESS,
    payload: { portfolio, response },
  }),
  getPortfolioPerfFailure: (
    portfolio: string,
    error: GetPortfolioPerfResponse
  ) => ({
    type: portfolioConstants.GET_PORTFOLIO_PERF_SUCCESS,
    payload: { portfolio, error },
  }),
  getPortfolioPerf: (payload: GetPortfolioPerfPayload) => async (
    dispatch: Dispatch
  ) => {
    const { name } = payload;
    dispatch(portfolioActions.getPortfolioPerfPending(name));
    let resPayload: GetPortfolioPerfResponse = {};
    try {
      const { data } = await portfolioAPI.getPortfolioPerformance(name);
      resPayload[name] = data;
      dispatch(portfolioActions.getPortfolioPerfSuccess(name, resPayload));
    } catch (error: any) {
      resPayload[name] = error.message;
      dispatch(portfolioActions.getPortfolioPerfFailure(name, resPayload));
    }
  },
  deletePortfolioPending: (portfolioName: string) => ({
    type: portfolioConstants.DELETE_PORTFOLIO_PENDING,
    payload: portfolioName,
  }),
  deletePortfolioSuccess: (response: DeletePortfolioPayload) => ({
    type: portfolioConstants.DELETE_PORTFOLIO_SUCCESS,
    payload: response,
  }),
  deletePortfolioFailure: (error: string) => ({
    type: portfolioConstants.DELETE_PORTFOLIO_FAILURE,
    payload: error,
  }),
  deletePortfolios: (payload: DeletePortfolioPayload) => async (
    dispatch: Dispatch
  ) => {
    const { portfolioName } = payload;
    dispatch(portfolioActions.deletePortfolioPending(portfolioName));
    try {
      await portfolioAPI.deletePortfolio(portfolioName);
      dispatch(portfolioActions.deletePortfolioSuccess({ portfolioName }));
    } catch (error: any) {
      dispatch(portfolioActions.deletePortfolioFailure(error.message));
    }
  },
  editPortfolioPending: () => ({
    type: portfolioConstants.EDIT_PORTFOLIO_PENDING,
  }),
  editPortfolioSuccess: (response: EditPortfolioPayload) => ({
    type: portfolioConstants.EDIT_PORTFOLIO_SUCCESS,
    payload: response,
  }),
  editPortfolioFailure: (error: string) => ({
    type: portfolioConstants.EDIT_PORTFOLIO_FAILURE,
    payload: error,
  }),
  editPortfolio: (payload: EditPortfolioPayload) => async (
    dispatch: Dispatch
  ) => {
    const { oldName, newName } = payload;
    dispatch(portfolioActions.editPortfolioPending());
    try {
      await portfolioAPI.editPortfolio(oldName, newName);
      dispatch(portfolioActions.editPortfolioSuccess({ oldName, newName }));
      dispatch(noteActions.getUserNotes());
      dispatch(
        noteActions.getRelevantNotes({
          stock_symbols: [],
          portfolio_names: [newName],
        })
      );
    } catch (error: any) {
      dispatch(portfolioActions.editPortfolioFailure(error.message));
    }
  },
};

interface CreatePortfolioPayload {
  newName: string;
}

interface GetPortfolioPerfPayload {
  name: string;
}

interface DeletePortfolioPayload {
  portfolioName: string;
}

interface EditPortfolioPayload {
  oldName: string;
  newName: string;
}

interface GetPortfoliosResponse {
  data: string[];
}

interface InvestmentInfo {
  investment_id: string;
  purchase_price: string;
  num_shares: number;
  purchase_date: string;
  total_change: number;
  stock_ticker: string;
}

interface GetPortfolioPerfResponse {
  [key: string]: {
    portfolio_change: number;
    investments: InvestmentInfo[];
  };
}

export default portfolioActions;
