import { USER_EXAMPLE } from "../constants/userConstants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StockData from '../../api/stockdata';

export const user_example = (data) => async (dispatch) => {
  dispatch({
    type: USER_EXAMPLE,
    payload: data,
  });
};

// The commented version is only applicable for
// export const getStockData = (symbol) => async (dispatch) => {
export const getStockData = async (symbol: string) => {
  try {
    const data = await StockData.fetch(symbol);

    return data;
  } catch (error) {
    console.log("UA Err: ", error);
    return error;
  }
}
