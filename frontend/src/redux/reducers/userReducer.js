import { USER_EXAMPLE } from "../constants/userConstants";

const userExampleReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_EXAMPLE:
      return { example: action.payload };
    default:
      return state;
  }
};

export default userExampleReducer;
