import investmentConstants from "../constants/investmentConstants";
import investmentAPI from "../../api/investment";
import { Dispatch } from "redux";

const investmentActions = {
  createStockPending: () => ({
    type: investmentConstants.CREATE_STOCK_PENDING,
  }),
  createStockSuccess: () => ({
    type: investmentConstants.CREATE_STOCK_SUCCESS,
  }),
  createStockFailure: (error: string) => ({
    type: investmentConstants.CREATE_STOCK_FAILURE,
    payload: error,
  }),
  createStock: (payload: CreateStockPayload) => async (dispatch: Dispatch) => {
    dispatch(investmentActions.createStockPending());
    try {
      const {
        portfolioName,
        stockTicker,
        numShares,
        purchaseDate,
        purchaseTime,
      } = payload;
      await investmentAPI.addStock(
        portfolioName,
        stockTicker,
        numShares,
        `${purchaseDate}T${purchaseTime}`
      );
      dispatch(investmentActions.createStockSuccess());
      dispatch(investmentActions.getStocks(portfolioName));
    } catch (error) {
      dispatch(investmentActions.createStockFailure(error.message));
    }
  },
  getStocksPending: (portfolio: string) => ({
    type: investmentConstants.GET_STOCKS_PENDING,
    payload: { portfolio },
  }),
  getStocksSuccess: (portfolio: string, response: InvestmentInfo[]) => ({
    type: investmentConstants.GET_STOCKS_SUCCESS,
    payload: { portfolio, response },
  }),
  getStocksFailure: (portfolio: string, error: string) => ({
    type: investmentConstants.GET_STOCKS_FAILURE,
    payload: { portfolio, error },
  }),
  getStocks: (portfolioName: string): any => async (dispatch: Dispatch) => {
    dispatch(investmentActions.getStocksPending(portfolioName));
    try {
      const { data } = await investmentAPI.getStocks(portfolioName);
      dispatch(investmentActions.getStocksSuccess(portfolioName, data));
    } catch (error) {
      dispatch(
        investmentActions.getStocksFailure(portfolioName, error.message)
      );
    }
  },
  deleteStockPending: (id: string) => ({
    type: investmentConstants.DELETE_STOCK_PENDING,
    payload: id,
  }),
  deleteStockSuccess: (response: InvestmentInfo[]) => ({
    type: investmentConstants.DELETE_STOCK_SUCCESS,
    payload: response,
  }),
  deleteStockFailure: (error: string) => ({
    type: investmentConstants.DELETE_STOCK_FAILURE,
    payload: error,
  }),
  deleteStock: (payload: DeleteStockPayload) => async (dispatch: Dispatch) => {
    const { investmentID, portfolioName } = payload;
    dispatch(investmentActions.deleteStockPending(investmentID));
    try {
      const { data } = await investmentAPI.deleteStock(investmentID);
      dispatch(investmentActions.deleteStockSuccess(data));
      dispatch(investmentActions.getStocks(portfolioName));
    } catch (error) {
      dispatch(investmentActions.deleteStockFailure(error.message));
    }
  },
};

interface CreateStockPayload {
  portfolioName: string;
  stockTicker: string;
  numShares: number;
  purchaseDate: string;
  purchaseTime: string;
}

interface DeleteStockPayload {
  investmentID: string;
  portfolioName: string;
}

interface InvestmentInfo {
  investment_id: string;
  purchase_price: string;
  num_shares: number;
  purchase_date: string;
  total_change: number;
  stock_ticker: string;
}

export default investmentActions;
