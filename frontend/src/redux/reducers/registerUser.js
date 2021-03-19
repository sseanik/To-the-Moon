import userConstants from "../constants/userConstants";

const initialState = {
  registerUser: {
    loading: false,
    token: "",
    error: null,
  },
};

const registerUser = (state = initialState, action) => {
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

export default registerUser;
