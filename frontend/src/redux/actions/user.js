import Types from '../constants/actionTypes';
import AuthAPI from '../../api/auth';

const Actions = {
  submitRegisterUserForm: (user) => ({
    type: Types.SUBMIT_REGISTER_USER_FORM,
    payload: user,
  }),
  registerUserPending: (user) => ({
    type: Types.REGISTER_USER_PENDING,
  }),
  registerUserSuccess: (response) => ({
    type: Types.REGISTER_USER_SUCCESS,
    response
  }),
  registerUserFailure: (error) => ({
    type: Types.REGISTER_USER_FAILURE,
    error
  }),
  login: (user) => ({
    type: Types.LOGIN,
    payload: user,
  }),
  registerUser: (payload) => {
    return async (dispatch) => {
      dispatch(Actions.registerUserPending());
      try {
        const res = await AuthAPI.register(...payload);
        // To test loading spinner
        setTimeout(() => {
          dispatch(Actions.registerUserSuccess(res));
        }, 2500);
      } catch (error) {
        setTimeout(() => {
          dispatch(Actions.registerUserFailure(error));
        }, 2500);
      }
    }
  }
}

export default Actions;