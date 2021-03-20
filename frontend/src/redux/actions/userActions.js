import AuthAPI from "../../api/auth";
import userConstants from "../constants/userConstants";

registerUserPending = () => ({
  type: userConstants.REGISTER_USER_PENDING,
});
registerUserSuccess = (response) => ({
  type: userConstants.REGISTER_USER_SUCCESS,
  payload: response,
});
registerUserFailure = (error) => ({
  type: userConstants.REGISTER_USER_FAILURE,
  payload: error,
});
loginUserPending = () => ({
  type: userConstants.LOGIN_PENDING,
});
loginUserSuccess = (response) => ({
  type: userConstants.LOGIN_SUCCESS,
  payload: response,
});
loginUserFailure = (error) => ({
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
    dispatch(registerUserSuccess());
    dispatch(loginUserSuccess());
    window.localStorage.setItem("userInfo", JSON.stringify(res));
  } catch (error) {
    dispatch(registerUserFailure());
  }
};

export const login = (payload) => async (dispatch) => {
  dispatch(loginUserPending());
  try {
    const { email, password } = payload;
    const res = await AuthAPI.login(email, password);
    dispatch(loginUserSuccess());
    window.localStorage.setItem("userInfo", JSON.stringify(res));
  } catch (error) {
    dispatch(loginUserFailure());
  }
};
