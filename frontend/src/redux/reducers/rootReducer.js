import { combineReducers } from "redux";
import submitRegisterUserForm from "./submitRegisterUserForm";
import registerUser from "./registerUser";
import loginUser from "./loginUser";
import createPortfolio from "./createPortfolio";
import createStock from "./createStock";
import submitCreatePortfolioForm from "./submitCreatePortfolioForm";
import submitCreateStockForm from "./submitCreateStockForm";
export default combineReducers({
  submitRegisterUserForm,
  registerUser,
  loginUser,
  createPortfolio,
  submitCreatePortfolioForm,
  submitCreateStockForm,
  createStock,
});
