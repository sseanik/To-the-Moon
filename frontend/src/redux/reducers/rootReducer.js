import { combineReducers } from 'redux';
import submitRegisterUserForm from './submitRegisterUserForm';
import registerUser from './registerUser';
export default combineReducers({
  submitRegisterUserForm,
  registerUser
});