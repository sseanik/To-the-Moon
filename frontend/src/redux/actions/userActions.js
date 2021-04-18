import AuthAPI from "../../api/auth";
import userConstants from "../constants/userConstants";

const userActions = {
  registerPending: () => ({
    type: userConstants.REGISTER_PENDING,
  }),
  registerSuccess: (response) => ({
    type: userConstants.REGISTER_SUCCESS,
    payload: response,
  }),
  registerFailure: (error) => ({
    type: userConstants.REGISTER_FAILURE,
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
  logoutSuccess: () => ({
    type: userConstants.LOGOUT,
  }),
  getUsernamePending: () => ({
    type: userConstants.GET_USERNAME_PENDING,
  }),
  getUsernameSuccess: (username) => ({
    type: userConstants.GET_USERNAME_SUCCESS,
    payload: username,
  }),
  getUsernameFailure: () => ({
    type: userConstants.GET_USERNAME_FAILURE,
  }),
  register: (payload) => async (dispatch) => {
    dispatch(userActions.registerPending());
    try {
      const { firstName, lastName, email, username, password } = payload;
      const res = await AuthAPI.register(
        username,
        firstName,
        lastName,
        email,
        password
      );
      window.localStorage.setItem("Token", res.token);
      dispatch(userActions.registerSuccess(res));
    } catch (error) {
      dispatch(userActions.registerFailure(error.message));
    }
  },
  login: (payload) => async (dispatch) => {
    dispatch(userActions.loginPending());
    try {
      const { email, password } = payload;
      const res = await AuthAPI.login(email, password);
      window.localStorage.setItem("Token", res.token);
      dispatch(userActions.loginSuccess(res));
    } catch (error) {
      dispatch(userActions.loginFailure(error.message));
    }
  },
  logout: () => (dispatch) => {
    window.localStorage.removeItem("Token");
    dispatch(userActions.logoutSuccess());
  },
  getUsername: () => async (dispatch) => {
    dispatch(userActions.getUsernamePending());
    try {
      const res = await AuthAPI.getUsername();
      dispatch(userActions.getUsernameSuccess(res.username));
    } catch (error) {
      dispatch(userActions.getUsernameFailure(error.message));
      dispatch(userActions.logout());
    }
  },
};

export default userActions;
