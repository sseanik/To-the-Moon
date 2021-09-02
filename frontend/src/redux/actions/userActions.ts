import { Dispatch } from "redux";
import AuthAPI from "../../api/auth";
import userConstants from "../constants/userConstants";

const userActions = {
  registerPending: () => ({
    type: userConstants.REGISTER_PENDING,
  }),
  registerSuccess: (response: AuthResponse) => ({
    type: userConstants.REGISTER_SUCCESS,
    payload: response,
  }),
  registerFailure: (error: string) => ({
    type: userConstants.REGISTER_FAILURE,
    payload: error,
  }),
  loginPending: () => ({
    type: userConstants.LOGIN_PENDING,
  }),
  loginSuccess: (response: AuthResponse) => ({
    type: userConstants.LOGIN_SUCCESS,
    payload: response,
  }),
  loginFailure: (error: string) => ({
    type: userConstants.LOGIN_FAILURE,
    payload: error,
  }),
  logoutSuccess: () => ({
    type: userConstants.LOGOUT,
  }),
  getUsernamePending: () => ({
    type: userConstants.GET_USERNAME_PENDING,
  }),
  getUsernameSuccess: (username: string) => ({
    type: userConstants.GET_USERNAME_SUCCESS,
    payload: username,
  }),
  getUsernameFailure: (error: string) => ({
    type: userConstants.GET_USERNAME_FAILURE,
    payload: error,
  }),
  register: (payload: RegisterPayload) => async (dispatch: Dispatch) => {
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
    } catch (error: any) {
      dispatch(userActions.registerFailure(error.message));
    }
  },
  login: (payload: LoginPayload) => async (dispatch: Dispatch) => {
    dispatch(userActions.loginPending());
    try {
      const { email, password } = payload;
      const res = await AuthAPI.login(email, password);
      window.localStorage.setItem("Token", res.token);
      dispatch(userActions.loginSuccess(res));
    } catch (error: any) {
      dispatch(userActions.loginFailure(error.message));
    }
  },
  logout: () => (dispatch: Dispatch) => {
    dispatch(userActions.logoutSuccess());
  },
  getUsername: () => async (dispatch: Dispatch) => {
    dispatch(userActions.getUsernamePending());
    try {
      const res = await AuthAPI.getUsername();
      dispatch(userActions.getUsernameSuccess(res.username));
    } catch (error: any) {
      dispatch(userActions.getUsernameFailure(error.message));
      userActions.logout();
    }
  },
};

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

interface AuthResponse {
  username: string;
  token: string;
  message: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export default userActions;
