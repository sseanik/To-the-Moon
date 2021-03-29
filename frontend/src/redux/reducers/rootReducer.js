import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "./userReducer";
import portfolioReducer from "./portfolioReducer";
import stockReducer from "./stockReducer";
export default combineReducers({
  userReducer,
  portfolioReducer,
  landingNewsReducer,
  stockNewsReducer,
  stockReducer,
});
