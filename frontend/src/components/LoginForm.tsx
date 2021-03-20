import { useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../redux/actions/userActions";
import { Formik } from "formik";
import * as Yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

interface StateProps {
  loading: boolean;
  token: string;
  error: Object;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const schema = Yup.object({
  email: Yup.string()
    .required("Email is required.")
    .max(30, "Must be 50 characters or less.")
    .email("Must be a valid email"),
  password: Yup.string()
    .required("Password is required.")
    .max(30, "Must be 16 characters or less.")
    .min(8, "Must be 8 characters or more"),
});

const LoginForm: React.FC<StateProps> = (props) => {
  const { loading, token, error } = props;
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) {
      history.push("/");
    }
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    login({ email, password });
  };

  const formComponent = (
    <Form onSubmit={(e) => onSubmit(e)}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  );

  const loadingSpinnerComponent = <Spinner animation="border" role="status" />;

  return loading ? loadingSpinnerComponent : formComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.loginUser.loginUser.loading,
  token: state.loginUser.loginUser.token,
  error: state.loginUser.loginUser.error,
});

export default connect(mapStateToProps)(LoginForm);
