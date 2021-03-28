import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "../reducers/userReducer";
import portfolioReducer from "./portfolioReducer";
export default combineReducers({
  userReducer,
  portfolioReducer,
  landingNewsReducer,
  stockNewsReducer,
});
