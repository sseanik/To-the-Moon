import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import { register } from "../redux/actions/userActions";
import { useHistory } from "react-router";
import { useEffect } from "react";

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

interface StateProps {
  loading: boolean;
  token: string;
  error: Object;
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
    .max(30, "Must be 50 characters or less.")
    .email("Must be a valid email"),
  username: Yup.string()
    .required("Username is required.")
    .max(30, "Must be 30 characters or less."),
  password: Yup.string()
    .required("Password is required.")
    .max(30, "Must be 16 characters or less.")
    .min(8, "Must be 8 characters or more"),
});

const RegisterForm: React.FC<StateProps> = (props) => {
  const { loading, token, error } = props;

  const history = useHistory();
  useEffect(() => {
    if (token || token !== "") {
      history.push("/");
    }
  });

  const spinnerComponent = <Spinner animation="border" role="status" />;
  const errorComponent = <Alert variant="danger">{error}</Alert>;

  const dispatch = useDispatch();
  const formComponent = (
    <Formik
      onSubmit={(values) => {
        dispatch(register(values));
      }}
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
            <Form.Control
              className="my-1"
              type="text"
              name="firstName"
              placeholder="Enter your first name"
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
            ) : (
              <></>
            )}
            <Form.Control
              className="my-1"
              type="text"
              name="lastName"
              placeholder="Enter your last name"
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
            ) : (
              <></>
            )}
            <Form.Control
              className="my-1"
              type="email"
              name="email"
              placeholder="Enter your email"
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
              placeholder="Enter your username"
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
              placeholder="Enter your password"
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
            ) : (
              <></>
            )}

            <Button className="w-100 my-1" variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        );
      }}
    </Formik>
  );

  return loading ? spinnerComponent : error ? errorComponent : formComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.registerUser.registerUser.loading,
  token: state.registerUser.registerUser.token,
  error: state.registerUser.registerUser.error,
});

export default connect(mapStateToProps)(RegisterForm);
