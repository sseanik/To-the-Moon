import investmentConstants from "../constants/investmentConstants";
import investmentAPI from "../../api/investment";

const investmentActions = {
  createStockPending: () => ({
    type: investmentConstants.CREATE_STOCK_PENDING,
  }),
  createStockSuccess: (response) => ({
    type: investmentConstants.CREATE_STOCK_SUCCESS,
    payload: response,
  }),
  createStockFailure: (error) => ({
    type: investmentConstants.CREATE_STOCK_FAILURE,
    payload: error,
  }),
  createStock: (payload) => async (dispatch) => {
    dispatch(investmentActions.createStockPending());
    try {
      const {
        portfolioName,
        stockTicker,
        numShares,
        purchaseDate,
        purchaseTime,
      } = payload;
      const { data } = await investmentAPI.addStock(
        portfolioName,
        stockTicker,
        numShares,
        `${purchaseDate}T${purchaseTime}`
      );
      dispatch(investmentActions.createStockSuccess(data));
      dispatch(investmentActions.getStocks(portfolioName));
    } catch (error) {
      dispatch(investmentActions.createStockFailure(error));
    }
  },
  getStocksPending: () => ({
    type: investmentConstants.GET_STOCKS_PENDING,
  }),
  getStocksSuccess: (response) => ({
    type: investmentConstants.GET_STOCKS_SUCCESS,
    payload: response,
  }),
  getStocksFailure: (error) => ({
    type: investmentConstants.GET_STOCKS_FAILURE,
    payload: error,
  }),
  getStocks: (portfolioName) => async (dispatch) => {
    dispatch(investmentActions.getStocksPending());
    try {
      const { data } = await investmentAPI.getStocks(portfolioName);
      dispatch(investmentActions.getStocksSuccess(data));
    } catch (error) {
      dispatch(investmentActions.getStocksFailure(error));
    }
  },
  deleteStockPending: (id) => ({
    type: investmentConstants.DELETE_STOCK_PENDING,
    payload: id,
  }),
  deleteStockSuccess: (response) => ({
    type: investmentConstants.DELETE_STOCK_SUCCESS,
    payload: response,
  }),
  deleteStockFailure: (error) => ({
    type: investmentConstants.DELETE_STOCK_FAILURE,
    payload: error,
  }),
  deleteStock: (payload) => async (dispatch) => {
    const { investmentID, portfolioName } = payload;
    dispatch(investmentActions.deleteStockPending(investmentID));
    try {
      const { data } = await investmentAPI.deleteStock(
        investmentID
      );
      dispatch(investmentActions.deleteStockSuccess(data));
      dispatch(investmentActions.getStocks(portfolioName));
    } catch (error) {
      dispatch(investmentActions.deleteStockFailure(error));
    }
  },
};

export default investmentActions;
