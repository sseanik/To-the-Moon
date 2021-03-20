import userConstants from "../constants/userConstants";

export const registerUser = (
  state = {
    registerUser: {
      loading: false,
      error: null,
      token: "",
    },
  },
  action
) => {
  switch (action.type) {
    case userConstants.REGISTER_USER_PENDING:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: true,
        },
      };
    case userConstants.REGISTER_USER_SUCCESS:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: false,
          error: null,
          token: action.payload.token,
        },
      };
    case userConstants.REGISTER_USER_FAILURE:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: false,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};

export const loginUser = (
  state = {
    loginUser: {
      loading: false,
      token: "",
      error: null,
    },
  },
  action
) => {
  switch (action.type) {
    case userConstants.LOGIN_PENDING:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: true,
        },
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: false,
          error: null,
          token: action.payload.token,
        },
      };
    case userConstants.LOGIN_FAILURE:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: false,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};
