import userConstants from "../constants/userConstants";
import Utils from "../../api/utils";

const initialState = {
  registerUser: {
    loading: false,
    message: null,
    error: null,
  },
  loginUser: {
    loading: false,
    message: null,
    error: null,
  },
  user: {
    loading: true,
  },
  token: Utils.getToken(),
  username: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // Register
    case userConstants.REGISTER_PENDING:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: true,
          message: null,
          error: null,
        },
      };
    case userConstants.REGISTER_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        username: action.payload.username,
        registerUser: {
          ...state.registerUser,
          loading: false,
          message: action.payload.message,
        },
      };
    case userConstants.REGISTER_FAILURE:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: false,
          error: action.payload,
        },
      };
    // Login
    case userConstants.LOGIN_PENDING:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: true,
          message: null,
          error: null,
        },
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        username: action.payload.username,
        loginUser: {
          ...state.loginUser,
          loading: false,
          message: action.payload.message,
        },
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: false,
          error: action.payload,
        },
      };
    // Logout
    case userConstants.LOGOUT:
      return {
        ...state,
        ...initialState,
      };
    // Username
    case userConstants.GET_USERNAME_PENDING:
      return {
        ...state,
        user: {
          ...state.user,
          loading: true,
        },
        username: null,
      };
    case userConstants.GET_USERNAME_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          loading: false,
        },
        username: action.payload
      };
    case userConstants.GET_USERNAME_FAILURE:
      return {
        ...state,
        user: {
          ...state.user,
          loading: false,
        },
        username: ""
      }
    default:
      return state;
  }
};

export default userReducer;