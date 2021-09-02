import stockConstants from "../constants/stockConstants";
import StockAPI from "../../api/stock";
import { Dispatch } from "redux";

const stockActions = {
  getStockBasicPending: () => ({
    type: stockConstants.GET_STOCK_BASIC_PENDING,
  }),
  getStockBasicSuccess: (response: BasicStockResponse) => ({
    type: stockConstants.GET_STOCK_BASIC_SUCCESS,
    payload: response,
  }),
  getStockBasicFailure: (error: string) => ({
    type: stockConstants.GET_STOCK_BASIC_FAILURE,
    payload: error,
  }),
  getStockIncomePending: () => ({
    type: stockConstants.GET_STOCK_INCOME_PENDING,
  }),
  getStockIncomeSuccess: (response: any) => ({
    type: stockConstants.GET_STOCK_INCOME_SUCCESS,
    payload: response,
  }),
  getStockIncomeFailure: (error: string) => ({
    type: stockConstants.GET_STOCK_INCOME_FAILURE,
    payload: error,
  }),
  getStockBalancePending: () => ({
    type: stockConstants.GET_STOCK_BALANCE_PENDING,
  }),
  getStockBalanceSuccess: (response: any) => ({
    type: stockConstants.GET_STOCK_BALANCE_SUCCESS,
    payload: response,
  }),
  getStockBalanceFailure: (error: string) => ({
    type: stockConstants.GET_STOCK_BALANCE_FAILURE,
    payload: error,
  }),
  getStockCashFlowPending: () => ({
    type: stockConstants.GET_STOCK_CASHFLOW_PENDING,
  }),
  getStockCashFlowSuccess: (response: any) => ({
    type: stockConstants.GET_STOCK_CASHFLOW_SUCCESS,
    payload: response,
  }),
  getStockCashFlowFailure: (error: string) => ({
    type: stockConstants.GET_STOCK_CASHFLOW_FAILURE,
    payload: error,
  }),
  getPredictionDailyPending: () => ({
    type: stockConstants.GET_PREDICTION_DAILY_PENDING,
  }),
  getPredictionDailySuccess: (response: any) => ({
    type: stockConstants.GET_PREDICTION_DAILY_SUCCESS,
    payload: response,
  }),
  getPredictionDailyFailure: (error: string) => ({
    type: stockConstants.GET_PREDICTION_DAILY_FAILURE,
    payload: error,
  }),
  getPaperTradingResultsPending: () => ({
    type: stockConstants.GET_PAPER_TRADING_PENDING,
  }),
  getPaperTradingResultsSuccess: (response: any) => ({
    type: stockConstants.GET_PAPER_TRADING_SUCCESS,
    payload: response,
  }),
  getPaperTradingResultsFailure: (error: string) => ({
    type: stockConstants.GET_PAPER_TRADING_FAILURE,
    payload: error,
  }),
  getStockBasic: (payload: SimpleStockPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(stockActions.getStockBasicPending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getBasic(symbol);
        dispatch(stockActions.getStockBasicSuccess(res));
      } catch (error: any) {
        dispatch(stockActions.getStockBasicFailure(error.message));
      }
    };
  },
  getStockIncome: (payload: SimpleStockPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(stockActions.getStockIncomePending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getIncome(symbol);
        dispatch(stockActions.getStockIncomeSuccess(res));
      } catch (error: any) {
        dispatch(stockActions.getStockIncomeFailure(error.message));
      }
    };
  },
  getStockBalance: (payload: SimpleStockPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(stockActions.getStockBalancePending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getBalance(symbol);
        dispatch(stockActions.getStockBalanceSuccess(res));
      } catch (error: any) {
        dispatch(stockActions.getStockBalanceFailure(error.message));
      }
    };
  },
  getStockCashFlow: (payload: SimpleStockPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(stockActions.getStockCashFlowPending());
      try {
        const { symbol } = payload;
        const res = await StockAPI.getCashFlow(symbol);
        dispatch(stockActions.getStockCashFlowSuccess(res));
      } catch (error: any) {
        dispatch(stockActions.getStockCashFlowFailure(error.message));
      }
    };
  },
  getPredictionDaily: (payload: PredictionPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(stockActions.getPredictionDailyPending());
      try {
        const { symbol, predictionType } = payload;
        const res = await StockAPI.getPredictionDaily(symbol, predictionType);
        dispatch(stockActions.getPredictionDailySuccess(res));
      } catch (error: any) {
        dispatch(stockActions.getPredictionDailyFailure(error.message));
      }
    };
  },
  getPaperTradingResults: (payload: PaperTradingResultsPayload) => {
    return async (dispatch: Dispatch) => {
      dispatch(stockActions.getPaperTradingResultsPending());
      try {
        const {
          symbol,
          initial_cash,
          commission,
          strategy,
          fromdate,
          todate,
        } = payload;
        const res = await StockAPI.getPaperTradingResults(
          symbol,
          initial_cash,
          commission,
          strategy,
          fromdate,
          todate
        );
        dispatch(stockActions.getPaperTradingResultsSuccess(res));
      } catch (error: any) {
        dispatch(stockActions.getPaperTradingResultsFailure(error.message));
      }
    };
  },
};

interface SimpleStockPayload {
  symbol: string;
}

interface PredictionPayload extends SimpleStockPayload {
  predictionType: string;
}

interface PaperTradingResultsPayload extends SimpleStockPayload {
  initial_cash: number;
  commission: number;
  strategy: string;
  fromdate: string;
  todate: string;
}

interface BasicStockResponse {
  name: string;
  data: {
    data: {
      "2. high": GraphPoint[];
      "3. low": GraphPoint[];
      "4. close": GraphPoint[];
    };
    data_intraday: {
      "4. close": GraphPoint[];
    };
    summary: Object[];
    fundamentals: Object[];
  };
}

interface GraphPoint {
  timestamp: number;
  value: number;
}

export default stockActions;
