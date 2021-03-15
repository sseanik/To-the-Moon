import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import Actions from "../redux/actions/user";
import ClipLoader from "react-spinners/ClipLoader";

interface IObjectKeys {
  [key: string]: string | number;
}

interface RegisterFormParams extends IObjectKeys {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface RegisterFormState {
  values: RegisterFormParams;
  errors: RegisterFormParams;
}

interface StateProps {
  registerForm: RegisterFormState;
  isLoading: boolean;
  error: Object;
  token: string;
}

interface DispatchProps {
  submitForm: (payload: RegisterFormParams) => void;
  registerUser: (payload: RegisterFormParams) => void;
}

const RegisterForm: React.FC<StateProps & DispatchProps> = (props) => {
  const {
    registerForm,
    isLoading,
    token,
    error,
    submitForm,
    registerUser,
  } = props;

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();
    registerUser({ username, firstName, lastName, email, password });
  };

  const onBlur = () => {
    submitForm({ username, firstName, lastName, email, password });
  };

  const formComponent = (
    <Form onSubmit={(e) => onSubmit(e)}>
      <Form.Group controlId="formBasicUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          isInvalid={registerForm.errors.username.length > 0}
          isValid={
            !!registerForm.values.username &&
            registerForm.errors.username.length === 0
          }
          onChange={(e) => setUsername(e.target.value)}
          onBlur={onBlur}
        />
        <Form.Control.Feedback type="invalid">
          {registerForm.errors.username}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">Choose a unique username.</Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicFirstName">
        <Form.Label>First name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter first name"
          isInvalid={registerForm.errors.firstName.length > 0}
          isValid={
            !!registerForm.values.firstName &&
            registerForm.errors.firstName.length === 0
          }
          onChange={(e) => setFirstName(e.target.value)}
          onBlur={onBlur}
        />
        <Form.Control.Feedback type="invalid">
          {registerForm.errors.firstName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formBasicLastName">
        <Form.Label>Last name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter last name"
          isInvalid={registerForm.errors.lastName.length > 0}
          isValid={
            !!registerForm.values.lastName &&
            registerForm.errors.lastName.length === 0
          }
          onChange={(e) => setLastName(e.target.value)}
          onBlur={onBlur}
        />
        <Form.Control.Feedback type="invalid">
          {registerForm.errors.lastName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          isInvalid={registerForm.errors.email.length > 0}
          isValid={
            !!registerForm.values.email &&
            registerForm.errors.email.length === 0
          }
          onChange={(e) => setEmail(e.target.value)}
          onBlur={onBlur}
        />
        <Form.Control.Feedback type="invalid">
          {registerForm.errors.email}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          isInvalid={registerForm.errors.password.length > 0}
          isValid={
            !!registerForm.values.password &&
            registerForm.errors.password.length === 0
          }
          onChange={(e) => setPassword(e.target.value)}
          onBlur={onBlur}
        />
        <Form.Control.Feedback type="invalid">
          {registerForm.errors.password}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Passwords must be between 4 and 16 characters long.
        </Form.Text>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Preparing rocket fuel...</h5>
    </div>
  );

  return isLoading ? loadingSpinnerComponent : formComponent;
};

const mapStateToProps = (state: any) => ({
  registerForm: state.submitRegisterUserForm.registerForm,
  isLoading: state.registerUser.registerUser.loading,
  token: state.registerUser.registerUser.token,
  error: state.registerUser.registerUser.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    submitForm: (formPayload: any) => {
      dispatch(Actions.submitRegisterUserForm(formPayload));
    },
    registerUser: (formPayload: any) => {
      dispatch(Actions.registerUser(formPayload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
