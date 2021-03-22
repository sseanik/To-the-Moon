import { combineReducers } from "redux";
import userReducer from "../reducers/userReducer";
import createStock from "./createStock";
import portfolioReducer from "./portfolioReducer";
import submitCreateStockForm from "./submitCreateStockForm";
export default combineReducers({
  userReducer,
  portfolioReducer,
  submitCreateStockForm,
  createStock,
});
