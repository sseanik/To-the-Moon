import { combineReducers } from "redux";
import submitRegisterUserForm from "./submitRegisterUserForm";
import registerUser from "./registerUser";
import loginUser from "./loginUser";
import createPortfolio from "./createPortfolio";
import submitCreatePortfolioForm from "./submitCreatePortfolioForm";
export default combineReducers({
  submitRegisterUserForm,
  registerUser,
  loginUser,
  createPortfolio,
  submitCreatePortfolioForm,
});
