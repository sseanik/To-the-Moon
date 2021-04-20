import * as config from "../config.json";
import Utils from "./utils";

const url = `http://localhost:${config.BACKEND_PORT}`;

const StockAPI = {
  getBasic: (symbol: string) => {
    const endpoint = `/stock?symbol=${symbol}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getIncome: (symbol: string) => {
    const endpoint = `/stock/income_statement?symbol=${symbol}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getBalance: (symbol: string) => {
    const endpoint = `/stock/balance_sheet?symbol=${symbol}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getCashFlow: (symbol: string) => {
    const endpoint = `/stock/cash_flow_statement?symbol=${symbol}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getPredictionDaily: (symbol: string, predictionType: string) => {
    const endpoint = `/stock/get_prediction_daily?symbol=${symbol}&prediction_type=${predictionType}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getPaperTradingResults: (
    symbol: string,
    initial_cash: number,
    commission: number,
    strategy: string,
    fromdate: string,
    todate: string
  ) => {
    const endpoint = `/stock/get_backtest?symbol=${symbol}&initial_cash=${initial_cash}&commission=${commission}&strategy=${strategy}&fromdate=${fromdate}&todate=${todate}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default StockAPI;
