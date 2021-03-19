import userConstants from "../constants/userConstants";

const initialState = {
  loginUser: {
    loading: false,
    token: "",
    error: null,
  },
};

const loginUser = (state = initialState, action) => {
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

export default loginUser;
