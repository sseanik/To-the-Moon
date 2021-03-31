import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "./userReducer";
import portfolioReducer from "./portfolioReducer";
import investmentReducer from "./investmentReducer";
import stockReducer from "./stockReducer";
import trendReducer from "./trendReducer";
export default combineReducers({
  userReducer,
  portfolioReducer,
  landingNewsReducer,
  stockNewsReducer,
  stockReducer,
  investmentReducer,
  trendReducer
});
