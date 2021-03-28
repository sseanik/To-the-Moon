import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "../reducers/userReducer";
import createStock from "./createStock";
import portfolioReducer from "./portfolioReducer";
import submitCreateStockForm from "./submitCreateStockForm";
export default combineReducers({
  userReducer,
  portfolioReducer,
  submitCreateStockForm,
  createStock,
  landingNewsReducer,
  stockNewsReducer,
});
