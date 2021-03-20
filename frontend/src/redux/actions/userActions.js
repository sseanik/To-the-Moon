import AuthAPI from "../../api/auth";
import userConstants from "../constants/userConstants";

const registerUserPending = () => ({
  type: userConstants.REGISTER_USER_PENDING,
});

const registerUserSuccess = (response) => ({
  type: userConstants.REGISTER_USER_SUCCESS,
  payload: response,
});

const registerUserFailure = (error) => ({
  type: userConstants.REGISTER_USER_FAILURE,
  payload: error,
});

const loginUserPending = () => ({
  type: userConstants.LOGIN_PENDING,
});

const loginUserSuccess = (response) => ({
  type: userConstants.LOGIN_SUCCESS,
  payload: response,
});

const loginUserFailure = (error) => ({
  type: userConstants.LOGIN_FAILURE,
  payload: error,
});

export const register = (payload) => async (dispatch) => {
  dispatch(registerUserPending());
  try {
    const { firstName, lastName, email, username, password } = payload;
    const res = await AuthAPI.register(
      firstName,
      lastName,
      email,
      username,
      password
    );
    dispatch(registerUserSuccess(res["token"]));
  } catch (error) {
    dispatch(registerUserFailure(error));
  }
};

export const login = (payload) => async (dispatch) => {
  dispatch(loginUserPending());
  try {
    const { email, password } = payload;
    const res = await AuthAPI.login(email, password);
    dispatch(loginUserSuccess());
    window.localStorage.setItem("token", JSON.stringify(res));
  } catch (error) {
    dispatch(loginUserFailure());
  }
};
