import Utils from './utils';
const url = 'http://127.0.0.1:5000';

const StockActions = {
  fetch_basic: (symbol, ignoreError = false) => {
      const endpoint = `/stock?symbol=${symbol}`;
      const options = {method: 'GET'};

      return Utils.getJSON(`${url}${endpoint}`, options);
  },
  fetch_income: (symbol, ignoreError = false) => {
      const endpoint = `/stock/income_statement?symbol=${symbol}`;
      const options = {method: 'GET'};

      return Utils.getJSON(`${url}${endpoint}`, options);
  },
  fetch_balance: (symbol, ignoreError = false) => {
      const endpoint = `/stock/balance_sheet?symbol=${symbol}`;
      const options = {method: 'GET'};

      return Utils.getJSON(`${url}${endpoint}`, options);
  },
  fetch_cash_flow: (symbol, ignoreError = false) => {
      const endpoint = `/stock/cash_flow_statement?symbol=${symbol}`;
      const options = {method: 'GET'};

      return Utils.getJSON(`${url}${endpoint}`, options);
  },

};

export default StockActions;
