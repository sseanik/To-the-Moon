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
      const { status, data, error } = await investmentAPI.addStock(
        portfolioName,
        stockTicker,
        numShares,
        `${purchaseDate}T${purchaseTime}`
      );
      if (status === 200) {
        dispatch(investmentActions.createStockSuccess(data));
        dispatch(investmentActions.getStocks(portfolioName));
      } else {
        dispatch(investmentActions.createStockFailure(error));
      }
    } catch (error) {
      dispatch(investmentActions.createStockFailure(error.message));
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
      const { status, data, error } = await investmentAPI.getStocks(
        portfolioName
      );
      if (status === 200) {
        dispatch(investmentActions.getStocksSuccess(data));
      } else {
        dispatch(investmentActions.getStocksFailure(error));
      }
    } catch (error) {
      dispatch(investmentActions.getStocksFailure(error.message));
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
      const { status, data, error } = await investmentAPI.deleteStock(
        investmentID
      );
      if (status === 200) {
        dispatch(investmentActions.deleteStockSuccess(data));
        dispatch(investmentActions.getStocks(portfolioName));
      } else {
        dispatch(investmentActions.deleteStockFailure(error));
      }
    } catch (error) {
      dispatch(investmentActions.deleteStockFailure(error.message));
    }
  },
};

export default investmentActions;
