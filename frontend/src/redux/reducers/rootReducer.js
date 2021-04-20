import { combineReducers } from "redux";
import { landingNewsReducer, stockNewsReducer } from "./newsReducer";
import userReducer from "./userReducer";
import portfolioReducer from "./portfolioReducer";
import forumReducer from "./forumReducer";
import investmentReducer from "./investmentReducer";
import stockReducer from "./stockReducer";
import trendReducer from "./trendReducer";
import noteReducer from "./noteReducer";
import watchlistReducer from "./watchlistReducer";
import dashboardReducer from "./dashboardReducer";
export default combineReducers({
  userReducer,
  portfolioReducer,
  landingNewsReducer,
  stockNewsReducer,
  forumReducer,
  stockReducer,
  investmentReducer,
  trendReducer,
  noteReducer,
  watchlistReducer,
  dashboardReducer,
});
