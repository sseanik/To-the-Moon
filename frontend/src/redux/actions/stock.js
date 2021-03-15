import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StockActions from '../../api/stockdata';

// The commented version is only applicable for
// export const getStockData = (symbol) => async (dispatch) => {
const Actions = {
  getStockData: async (symbol: string) => {
    try {
      const data = await StockActions.fetch_basic(symbol);

      return data;
    } catch (error) {
      console.log("UA Err: ", error);
      return error;
    }
  },
  getIncomeStatement: async (symbol: string) => {
    try {
      const data = await StockActions.fetch_income(symbol);

      return data;
    } catch (error) {
      console.log("UA Err: ", error);
      return error;
    }
  },
  getBalanceSheet: async (symbol: string) => {
      try {
        const data = await StockActions.fetch_balance(symbol);

        return data;
      } catch (error) {
        console.log("UA Err: ", error);
        return error;
      }
  },
  getCashFlow: async (symbol: string) => {
      try {
        const data = await StockActions.fetch_cash_flow(symbol);

        return data;
      } catch (error) {
        console.log("UA Err: ", error);
        return error;
      }
  },
}

export default Actions;
