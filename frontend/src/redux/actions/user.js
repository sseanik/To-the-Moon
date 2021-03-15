import Types from '../constants/actionTypes';
import AuthAPI from '../../api/auth';

const Actions = {
  submitRegisterUserForm: (user) => ({
    type: Types.SUBMIT_REGISTER_USER_FORM,
    payload: user,
  }),
  registerUserPending: () => ({
    type: Types.REGISTER_USER_PENDING,
  }),
  registerUserSuccess: (response) => ({
    type: Types.REGISTER_USER_SUCCESS,
    payload: response
  }),
  registerUserFailure: (error) => ({
    type: Types.REGISTER_USER_FAILURE,
    payload: error
  }),
  loginPending: () => ({
    type: Types.LOGIN_PENDING,
  }),
  loginSuccess: (response) => ({
    type: Types.LOGIN_SUCCESS,
    payload: response
  }),
  loginFailure: (error) => ({
    type: Types.LOGIN_FAILURE,
    payload: error
  }),
  registerUser: (payload) => {
    return async (dispatch) => {
      dispatch(Actions.registerUserPending());
      try {
        const { username, firstName, lastName, email, password } = payload;
        const res = await AuthAPI.register(username, firstName, lastName, email, password);
        // To test loading spinner
        setTimeout(() => {
          dispatch(Actions.registerUserSuccess(res));
        }, 2500);
        const { token } = res;
        window.localStorage.setItem("Token", token);
      } catch (error) {
        setTimeout(() => {
          dispatch(Actions.registerUserFailure(error));
        }, 2500);
      }
    }
  },
  loginUser: (payload) => {
    return async (dispatch) => {
      dispatch(Actions.loginPending());
      try {
        const { email, password } = payload;
        const res = await AuthAPI.login(email, password);
        // To test loading spinner
        setTimeout(() => {
          dispatch(Actions.loginSuccess(res));
        }, 2500);
        const { token } = res;
        window.localStorage.setItem("Token", token);
      } catch (error) {
        setTimeout(() => {
          dispatch(Actions.loginFailure(error));
        }, 2500);
      }
    }
  }
}

export default Actions;