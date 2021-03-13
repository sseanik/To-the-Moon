import Types from '../constants/actionTypes';

const initialState = {
  registerUser: {
    loading: false,
    token: "",
    error: null,
  }
}

const registerUser = (state = initialState, action) => {
  switch(action.type) {
    case Types.REGISTER_USER_PENDING:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: true,
        }
      };
    case Types.REGISTER_USER_SUCCESS:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: false,
          error: null,
          token: action.payload,
        }
      };
    case Types.REGISTER_USER_FAILURE:
      return {
        ...state,
        registerUser: {
          ...state.registerUser,
          loading: false,
          error: action.payload,
        }
      };
    default:
      return state;
  }
}
  
export default registerUser;