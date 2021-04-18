import stockConstants from "../constants/stockConstants";
import StockAPI from "../../api/stock";

const stockActions = {
  getStockBasicPending: () => ({
    type: stockConstants.GET_STOCK_BASIC_PENDING,
  }),
  getStockBasicSuccess: (response) => ({
    type: stockConstants.GET_STOCK_BASIC_SUCCESS,
    payload: response,
  }),
  getStockBasicFailure: (error) => ({
    type: stockConstants.GET_STOCK_BASIC_FAILURE,
    payload: error,
  }),
  getStockIncomePending: () => ({
    type: stockConstants.GET_STOCK_INCOME_PENDING,
  }),
  getStockIncomeSuccess: (response) => ({
    type: stockConstants.GET_STOCK_INCOME_SUCCESS,
    payload: response,
  }),
  getStockIncomeFailure: (error) => ({
    type: stockConstants.GET_STOCK_INCOME_FAILURE,
    payload: error,
  }),
  getStockBalancePending: () => ({
    type: stockConstants.GET_STOCK_BALANCE_PENDING,
  }),
  getStockBalanceSuccess: (response) => ({
    type: stockConstants.GET_STOCK_BALANCE_SUCCESS,
    payload: response,
  }),
  getStockBalanceFailure: (error) => ({
    type: stockConstants.GET_STOCK_BALANCE_FAILURE,
    payload: error,
  }),
  getStockCashFlowPending: () => ({
    type: stockConstants.GET_STOCK_CASHFLOW_PENDING,
  }),
  getStockCashFlowSuccess: (response) => ({
    type: stockConstants.GET_STOCK_CASHFLOW_SUCCESS,
    payload: response,
  }),
  getStockCashFlowFailure: (error) => ({
    type: stockConstants.GET_STOCK_CASHFLOW_FAILURE,
    payload: error,
  }),
  getPredictionDailyPending: () => ({
    type: stockConstants.GET_PREDICTION_DAILY_PENDING,
  }),
  getPredictionDailySuccess: (response) => ({
    type: stockConstants.GET_PREDICTION_DAILY_SUCCESS,
    payload: response,
  }),
  getPredictionDailyFailure: (error) => ({
    type: stockConstants.GET_PREDICTION_DAILY_FAILURE,
    payload: error,
  }),
  getPaperTradingResultsPending: () => ({
    type: stockConstants.GET_PAPER_TRADING_PENDING,
  }),
  getPaperTradingResultsSuccess: (response) => ({
    type: stockConstants.GET_PAPER_TRADING_SUCCESS,
    payload: response,
  }),
  getPaperTradingResultsFailure: (error) => ({
    type: stockConstants.GET_PAPER_TRADING_FAILURE ,
    payload: error,
  }),
  getStockBasic: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.getStockBasicPending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getBasic(symbol);
        dispatch(stockActions.getStockBasicSuccess(res));
      } catch (error) {
        dispatch(stockActions.getStockBasicFailure(error.message));
      }
    };
  },
  getStockIncome: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.getStockIncomePending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getIncome(symbol);
        dispatch(stockActions.getStockIncomeSuccess(res));
      } catch (error) {
        dispatch(stockActions.getStockIncomeFailure(error.message));
      }
    };
  },
  getStockBalance: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.getStockBalancePending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getBalance(symbol);
        dispatch(stockActions.getStockBalanceSuccess(res));
      } catch (error) {
        dispatch(stockActions.getStockBalanceFailure(error.message));
      }
    };
  },
  getStockCashFlow: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.getStockCashFlowPending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getCashFlow(symbol);
        dispatch(stockActions.getStockCashFlowSuccess(res));
      } catch (error) {
        dispatch(stockActions.getStockCashFlowFailure(error.message));
      }
    };
  },
  getPredictionDaily: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.getPredictionDailyPending());
      try {
        const { symbol, predictionType } = payload;
        const res = await StockAPI.getPredictionDaily(symbol, predictionType);
        dispatch(stockActions.getPredictionDailySuccess(res));
      } catch (error) {
        dispatch(stockActions.getPredictionDailyFailure(error.message));
      }
    };
  },
  getPaperTradingResults: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.getPaperTradingResultsPending());
      try {
        const { symbol, initial_cash, commission, strategy, fromdate, todate } = payload;
        const res = await StockAPI.getPaperTradingResults(symbol, initial_cash, commission, strategy, fromdate, todate);
        if (res.status === 200) {
          dispatch(stockActions.getPaperTradingResultsSuccess(res));
        } else {
          dispatch(stockActions.getPaperTradingResultsFailure(res.error));
        }
      } catch (error) {
        dispatch(stockActions.getPaperTradingResultsFailure(error.message));
      }
    }
  },
};

export default stockActions;
