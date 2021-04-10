import * as config from '../config.json';
import Utils from './utils';

const url = `http://localhost:${config.BACKEND_PORT}`;
const urlTrading = `http://localhost:${5002}`;

const StockAPI = {
  getBasic: (symbol) => {
    const endpoint = `/stock?symbol=${symbol}`;
    const options = {method: 'GET'};

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getIncome: (symbol) => {
    const endpoint = `/stock/income_statement?symbol=${symbol}`;
    const options = {method: 'GET'};

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getBalance: (symbol) => {
    const endpoint = `/stock/balance_sheet?symbol=${symbol}`;
    const options = {method: 'GET'};

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getCashFlow: (symbol) => {
    const endpoint = `/stock/cash_flow_statement?symbol=${symbol}`;
    const options = {method: 'GET'};

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getPredictionDaily: (symbol, predictionType) => {
    const endpoint = `/stock/get_prediction_daily?symbol=${symbol}&prediction_type=${predictionType}`;
    const options = {method: 'GET'};

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
  getPaperTradingResults: (symbol, initial_cash, commission, strategy, fromdate, todate) => {
    // const endpoint = `/get_backtest`;
    // const options = {
    //   method: 'POST',
    //   mode: 'cors',
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     tickers: [symbol],
    //     timeframes: { '1D': 1, },
    //     timeframe_units: "Days",
    //     initial_cash: initial_cash,
    //     commission: commission,
    //     timezone: "US/Eastern",
    //     strategy: strategy,
    //     fromdate: fromdate,
    //     todate: todate,
    //   }),
    // };
    const endpoint = `/stock/get_backtest?symbol=${symbol}&initial_cash=${initial_cash}&commission=${commission}&strategy=${strategy}&fromdate=${fromdate}&todate=${todate}`;
    const options = {method: 'GET'};

    return Utils.getJSON(`${url}${endpoint}`, options);
  },
};

export default StockAPI;
