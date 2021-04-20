import { useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { useHistory, useParams } from "react-router";
import portfolioActions from "../redux/actions/portfolioActions";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

interface RouteMatchParams {
  name: string;
}

interface StateProps {
  loading: boolean;
  error: string;
  oldName: string;
  newName: string;
}

interface DispatchProps {
  editPortfolio: (payload: any) => void;
}

interface EditPortfolioParams {
  oldName: string;
  newName: string;
}

const initialValues: EditPortfolioParams = {
  oldName: "",
  newName: "",
};

const schema = Yup.object({
  newName: Yup.string()
    .required("Portfolio name is required.")
    .max(30, "Portfolio name must be 30 characters or less."),
});

const EditPortfolioForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { name: portfolioName } = useParams<RouteMatchParams>();
  const { loading, error, oldName, newName, editPortfolio } = props;
  initialValues.oldName = portfolioName;

  const history = useHistory();

  useEffect(() => {
    oldName === portfolioName
      ? history.push(`/portfolio/${newName}`)
      : console.log("DO NOT CHANGE");
  }, [oldName, newName, portfolioName, history]);

  const formComponent = (
    <Formik
      onSubmit={editPortfolio}
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
          <Form noValidate onSubmit={handleSubmit} className="my-2">
            {error ? <Alert variant="danger">{error}</Alert> : null}
            <Form.Label>New Portfolio Name</Form.Label>
            <Form.Control
              type="text"
              name="newName"
              placeholder="Enter a portfolio name"
              value={values.newName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.newName && touched.newName}
            />
            {errors.newName ? (
              <Form.Control.Feedback type="invalid">
                {errors.newName}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                Portfolio name must be unique.
              </Form.Text>
            )}

            <Button type="submit" variant="success" className="my-2">
              Change Name
            </Button>
          </Form>
        );
      }}
    </Formik>
  );

  return loading ? (
    <ClipLoader color={"green"} loading={loading} />
  ) : (
    formComponent
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.editPortfolio.loading,
  error: state.portfolioReducer.editPortfolio.error,
  oldName: state.portfolioReducer.editPortfolio.oldName,
  newName: state.portfolioReducer.editPortfolio.newName,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    editPortfolio: (formPayload: any) => {
      dispatch(portfolioActions.editPortfolio(formPayload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditPortfolioForm);
