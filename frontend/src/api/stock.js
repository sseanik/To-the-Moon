import * as config from '../config.json';
import Utils from './utils';

const url = `http://localhost:${config.BACKEND_PORT}`;

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

};

export default StockAPI;
