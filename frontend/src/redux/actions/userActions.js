import axios from "axios";
import userConstants from "../constants/userConstants";

export const register = (
  first_name,
  last_name,
  email,
  username,
  password
) => async (dispatch) => {
  dispatch({
    type: userConstants.REGISTER_USER_PENDING,
    payload: { first_name, last_name, email, username, password },
  });
  try {
    const { data } = await axios.post("/register", {
      first_name,
      last_name,
      email,
      username,
      password,
    });
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
    const { data } = await axios.post("/login", { email, password });
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
