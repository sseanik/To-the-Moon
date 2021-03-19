import userConstants from "../constants/userConstants";
import AuthAPI from "../../api/auth";

const Actions = {
  submitRegisterUserForm: (user) => ({
    type: userConstants.SUBMIT_REGISTER_USER_FORM,
    payload: user,
  }),
  registerUserPending: () => ({
    type: userConstants.REGISTER_USER_PENDING,
  }),
  registerUserSuccess: (response) => ({
    type: userConstants.REGISTER_USER_SUCCESS,
    payload: response,
  }),
  registerUserFailure: (error) => ({
    type: userConstants.REGISTER_USER_FAILURE,
    payload: error,
  }),
  loginPending: () => ({
    type: userConstants.LOGIN_PENDING,
  }),
  loginSuccess: (response) => ({
    type: userConstants.LOGIN_SUCCESS,
    payload: response,
  }),
  loginFailure: (error) => ({
    type: userConstants.LOGIN_FAILURE,
    payload: error,
  }),
  registerUser: (payload) => {
    return async (dispatch) => {
      dispatch(Actions.registerUserPending());
      try {
        const { username, firstName, lastName, email, password } = payload;
        const res = await AuthAPI.register(
          username,
          firstName,
          lastName,
          email,
          password
        );
        // To test loading spinner
        setTimeout(() => {
          dispatch(Actions.registerUserSuccess(res));
        }, 2500);
      } catch (error) {
        setTimeout(() => {
          dispatch(Actions.registerUserFailure(error));
        }, 2500);
      }
    };
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
    };
  },
};

export default Actions;
