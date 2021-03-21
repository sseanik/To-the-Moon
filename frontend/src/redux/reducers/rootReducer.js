import { combineReducers } from "redux";
import { registerUser, loginUser } from "../reducers/userReducers";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import createPortfolio from "./createPortfolio";
import createStock from "./createStock";
import submitCreatePortfolioForm from "./submitCreatePortfolioForm";
import submitCreateStockForm from "./submitCreateStockForm";
export default combineReducers({
  registerUser,
  loginUser,
  createPortfolio,
  submitCreatePortfolioForm,
  submitCreateStockForm,
  createStock,
  landingNewsReducer,
  stockNewsReducer,
});
