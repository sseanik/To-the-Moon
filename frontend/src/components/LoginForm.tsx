import { useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { connect } from "react-redux";
import userActions from "../redux/actions/userActions";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";

interface LoginFormValues {
  email: string;
  password: string;
}

interface StateProps {
  loading: boolean;
  message: string;
  error: Object;
}

interface DispatchProps {
  login: (payload: LoginFormValues) => void;
}

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const schema = Yup.object({
  email: Yup.string()
    .required("Email is required."),
  password: Yup.string()
    .required("Password is required.")
});

const LoginForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, message, error, login } = props;
  const history = useHistory();

  useEffect(() => {
    const successMessage = "Successfully logged in!"
    if (message === successMessage) {
      history.push("/");
    }
  }, [message]);

  const errorComponent = (
    <Alert variant="danger">
      {error}
    </Alert>
  );

  const messageComponent = (
    <Alert variant="success">
      {message}
    </Alert>
  );

  return (
    <Formik
      onSubmit={login}
      initialValues={initialValues}
      validationSchema={schema}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        errors,
        touched,
      }) => {
        return (
          <Form onSubmit={handleSubmit}>
            { error ? errorComponent : null }
            { message ? messageComponent : null }
            <ClipLoader color={"green"} loading={loading}>
              <span className="sr-only">Loading...</span>
            </ClipLoader>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.email && touched.email}
              />
              {errors.email && touched.email ? (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            ) : null}
            </Form.Group>
            
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.password && touched.password}
              />
              {errors.password && touched.password ? (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            ) : null}
            </Form.Group>

            <Button disabled={loading} variant="primary" type="submit">
              Login
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.userReducer.loginUser.loading,
  message: state.userReducer.loginUser.message,
  error: state.userReducer.loginUser.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    login: (payload: LoginFormValues) => dispatch(userActions.login(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
