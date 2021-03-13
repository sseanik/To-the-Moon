import Types from "../constants/actionTypes";

const initialState = {
  registerForm: {
    values: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    },
    errors: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  }
};

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const validateRegister = (payload) => {
  const { username, firstName, lastName, email, password } = payload;
  const errors = {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };
  
  if (!username && username.length === 0) {
    errors.username = "Username is required";
  }

  if (!firstName && firstName.length === 0) {
    errors.firstName = "First name is required";
  }

  if (!lastName && lastName.length === 0) {
    errors.lastName = "Last name is required";
  }

  if (!email && email.length === 0) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Email is invalid";
  }

  if (!password && password.length === 0) {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must have at least 8 characters";
  } else if (password.length > 16) {
    errors.password = "Password must have 16 characters or less";
  }

  return errors;
}

const submitRegisterUserForm = (state = initialState, action) => {
  switch(action.type) {
    case Types.SUBMIT_REGISTER_USER_FORM:
      const { payload } = action;
      return {
        ...state,
        registerForm: {
          values: payload,
          errors: validateRegister(payload)
        }
      }
    default:
      return state;
  }
}

export default submitRegisterUserForm;