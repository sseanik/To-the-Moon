import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "../reducers/userReducer";
import createPortfolio from "./createPortfolio";
import createStock from "./createStock";
import submitCreatePortfolioForm from "./submitCreatePortfolioForm";
import submitCreateStockForm from "./submitCreateStockForm";
export default combineReducers({
  userReducer,
  createPortfolio,
  submitCreatePortfolioForm,
  submitCreateStockForm,
  createStock,
  landingNewsReducer,
  stockNewsReducer,
});
