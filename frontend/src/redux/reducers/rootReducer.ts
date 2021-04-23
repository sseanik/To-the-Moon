import { combineReducers } from "redux";
import {
  landingNewsReducer,
  stockNewsReducer,
  stockNewsMultiReducer,
} from "./newsReducer";
import userReducer from "./userReducer";
import portfolioReducer from "./portfolioReducer";
import forumReducer from "./forumReducer";
import investmentReducer from "./investmentReducer";
import stockReducer from "./stockReducer";
import trendReducer from "./trendReducer";
import noteReducer from "./noteReducer";
import screenerReducer from "./screenerReducer";
import watchlistReducer from "./watchlistReducer";
import dashboardReducer from "./dashboardReducer";
export default combineReducers({
  userReducer,
  portfolioReducer,
  landingNewsReducer,
  stockNewsReducer,
  stockNewsMultiReducer,
  forumReducer,
  stockReducer,
  investmentReducer,
  trendReducer,
  noteReducer,
  screenerReducer,
  watchlistReducer,
  dashboardReducer,
});
