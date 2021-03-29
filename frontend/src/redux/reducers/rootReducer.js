import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "../reducers/userReducer";
import portfolioReducer from "./portfolioReducer";
import investmentReducer from "./investmentReducer";
import stockReducer from "./stockReducer";
export default combineReducers({
  userReducer,
  portfolioReducer,
  landingNewsReducer,
  stockNewsReducer,
  stockReducer,
  investmentReducer,
});
