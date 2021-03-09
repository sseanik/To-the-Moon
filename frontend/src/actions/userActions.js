import { USER_EXAMPLE } from "../constants/userConstants";

export const user_example = (data) => async (dispatch) => {
    dispatch({
        type: USER_EXAMPLE,
        payload: data,
    });
};
