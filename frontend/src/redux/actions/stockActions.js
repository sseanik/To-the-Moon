import stockConstants from "../constants/stockConstants";
import stockAPI from "../../api/stockAPI";

const stockActions = {
  submitCreateStockForm: (user) => ({
    type: stockConstants.SUBMIT_CREATE_STOCK_FORM,
    payload: user,
  }),
  createStockPending: () => ({
    type: stockConstants.CREATE_STOCK_PENDING,
  }),
  createStockSuccess: (response) => ({
    type: stockConstants.CREATE_STOCK_SUCCESS,
    payload: response,
  }),
  createStockFailure: (error) => ({
    type: stockConstants.CREATE_STOCK_FAILURE,
    payload: error,
  }),
  createStock: (payload) => {
    return async (dispatch) => {
      dispatch(stockActions.createStockPending());
      try {
        const { portfolioName, stockName } = payload;
        const res = await stockAPI.addStock(
          portfolioName,
          stockName 
        );
        setTimeout(() => {
          dispatch(stockActions.createStockSuccess(res));
        }, 2500);
      } catch (error) {
        setTimeout(() => {
          dispatch(stockActions.createStockFailure(error));
        }, 2500);
      }
    };
  },
};

export default stockActions;
