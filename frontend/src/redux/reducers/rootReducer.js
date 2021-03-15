import { combineReducers } from "redux";
import submitRegisterUserForm from "./submitRegisterUserForm";
import registerUser from "./registerUser";
import loginUser from "./loginUser";
export default combineReducers({
  submitRegisterUserForm,
  registerUser,
  loginUser,
});
