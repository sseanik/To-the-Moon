import * as config from "../config.json";
import Utils from "./utils";

const url = config.API;

const StockAPI = {
  getBasic: (symbol: string) => {
    const endpoint = `/stock?symbol=${encodeURI(symbol)}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getIncome: (symbol: string) => {
    const endpoint = `/stock/income_statement?symbol=${encodeURI(symbol)}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getBalance: (symbol: string) => {
    const endpoint = `/stock/balance_sheet?symbol=${encodeURI(symbol)}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getCashFlow: (symbol: string) => {
    const endpoint = `/stock/cash_flow_statement?symbol=${encodeURI(symbol)}`;
    const options = { method: "GET" };

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getPredictionDaily: (symbol: string, predictionType: string) => {
    const endpoint = `/stock/get_prediction_daily?symbol=${encodeURI(symbol)}&prediction_type=${encodeURI(predictionType)}`;
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
