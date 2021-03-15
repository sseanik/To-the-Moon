import Types from '../constants/actionTypes';

const initialState = {
  loginUser: {
    loading: false,
    token: "",
    error: null,
  }
}

const loginUser = (state = initialState, action) => {
  switch (action.type) {
    case Types.LOGIN_PENDING:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: true,
        }
      };
    case Types.LOGIN_SUCCESS:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: false,
          error: null,
          token: action.payload.token,
        }
      };
    case Types.LOGIN_FAILURE:
      return {
        ...state,
        loginUser: {
          ...state.loginUser,
          loading: false,
          error: action.payload.error,
        }
      };
    default:
      return state;
  }
}
  
export default loginUser;