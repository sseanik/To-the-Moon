import AuthAPI from "../../api/auth";
import userConstants from "../constants/userConstants";

export const register = (
  firstName,
  lastName,
  email,
  username,
  password
) => async (dispatch) => {
  dispatch({
    type: userConstants.REGISTER_USER_PENDING,
    payload: { firstName, lastName, email, username, password },
  });
  try {
    const { data } = await AuthAPI.register(
      firstName,
      lastName,
      email,
      username,
      password
    );
    dispatch({
      type: userConstants.REGISTER_USER_SUCCESS,
      payload: data,
    });
    dispatch({
      type: userConstants.LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: userConstants.REGISTER_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const login = (email, password) => async (dispatch) => {
  dispatch({
    type: userConstants.LOGIN_PENDING,
    payload: { email, password },
  });
  try {
    const { data } = await AuthAPI.login(email, password);
    dispatch({
      type: userConstants.LOGIN_SUCCESS,
      payload: data,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: userConstants.LOGIN_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
