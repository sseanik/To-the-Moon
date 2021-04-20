import userConstants from "../constants/userConstants";
import Utils from "../../api/utils";
import { Action } from "redux";
import { SimpleReduxState } from "../../types/generalTypes";

const userReducer = (state = initialState, action: UserAction) => {
  switch (action.type) {
    // Register
    case userConstants.REGISTER_PENDING:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: true,
          message: "",
          error: "",
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
          message: "",
          error: "",
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
        username: action.payload,
      };
    case userConstants.GET_USERNAME_FAILURE:
      return {
        ...state,
        user: {
          ...state.user,
          loading: false,
        },
        username: "",
      };
    default:
      return state;
  }
};

interface UserAction extends Action {
  payload: {
    token?: string;
    username?: string;
    message?: string;
  };
}

interface MessageUserState extends SimpleReduxState {
  message: string;
}

interface InitialState {
  registerUser: MessageUserState;
  loginUser: MessageUserState;
  user: { loading: boolean };
  token: string | null;
  username: string;
}

const initialState: InitialState = {
  registerUser: {
    loading: false,
    message: "",
    error: "",
  },
  loginUser: {
    loading: false,
    message: "",
    error: "",
  },
  user: {
    loading: true,
  },
  token: Utils.getToken(),
  username: "",
};

export default userReducer;
