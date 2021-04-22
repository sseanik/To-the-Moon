import { useEffect } from "react";
import { Alert, Form, Button, Row } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import userActions from "../redux/actions/userActions";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

interface StateProps {
  loading: boolean;
  message: string;
}

interface DispatchProps {
  register: (payload: RegisterFormValues) => void;
}

const initialValues: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
};

const schema = Yup.object({
  firstName: Yup.string()
    .required("First name is required.")
    .max(30, "Must be 30 characters or less."),
  lastName: Yup.string()
    .required("Last name is required.")
    .max(30, "Must be 30 characters or less."),
  email: Yup.string()
    .required("Email is required.")
    .max(50, "Must be 50 characters or less.")
    .email("Must be a valid email"),
  username: Yup.string()
    .required("Username is required.")
    .max(30, "Must be 30 characters or less."),
  password: Yup.string()
    .required("Password is required.")
    .max(16, "Must be 16 characters or less.")
    .min(8, "Must be 8 characters or more"),
});

const RegisterForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, message, register } = props;
  const history = useHistory();

  useEffect(() => {
    const successMessage = "Successfully registered!";
    if (message === successMessage) {
      history.push("/");
    }
  }, [message, history]);

  const messageComponent = <Alert variant="success">{message}</Alert>;

  return (
    <Formik
      onSubmit={register}
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
          <Form noValidate onSubmit={handleSubmit} className="w-50 my-2">
            <h4>
              Become an astronaut today! Sign up with us to start your journey{" "}
              <i>To The Moon</i>.
            </h4>
            {error ? errorComponent : null}
            {message ? messageComponent : null}
            <Form.Control
              className="my-1"
              type="text"
              name="firstName"
              placeholder="First name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.firstName && touched.firstName}
              isValid={!errors.firstName && touched.firstName}
            />
            {errors.firstName && touched.firstName ? (
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            ) : null}
            <Form.Control
              className="my-1"
              type="text"
              name="lastName"
              placeholder="Last name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.lastName && touched.lastName}
              isValid={!errors.lastName && touched.lastName}
            />
            {errors.lastName && touched.lastName ? (
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            ) : null}
            <Form.Control
              className="my-1"
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.email && touched.email}
              isValid={!errors.email && touched.email}
            />
            {errors.email && touched.email ? (
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                Email must be unique.
              </Form.Text>
            )}
            <Form.Control
              className="my-1"
              type="text"
              name="username"
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.username && touched.username}
              isValid={!errors.username && touched.username}
            />
            {errors.username && touched.username ? (
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                Username must be unique.
              </Form.Text>
            )}
            <Form.Control
              className="my-1"
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.password && touched.password}
              isValid={!errors.password && touched.password}
            />
            {errors.password && touched.password ? (
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            ) : null}
            <Row className="justify-content-center">
              <ClipLoader color={"green"} loading={loading}>
                <span className="sr-only">Loading...</span>
              </ClipLoader>
            </Row>
            <Button
              disabled={loading}
              className="w-100 my-1"
              variant="primary"
              type="submit"
            >
              {loading ? "Stitching astronaut suit..." : "Sign up"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.userReducer.registerUser.loading,
  message: state.userReducer.registerUser.message,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    register: (payload: RegisterFormValues) =>
      dispatch(userActions.register(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
