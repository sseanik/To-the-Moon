import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import portfolioActions from "../redux/actions/portfolioActions";

interface CreatePortfolioFormValues {
  newName: string;
}

interface StateProps {
  loading: boolean;
  error: Object;
}

interface DispatchProps {
  createPortfolio: (payload: CreatePortfolioFormValues) => void;
}

const initialValues: CreatePortfolioFormValues = {
  newName: "",
};

const schema = Yup.object({
  newName: Yup.string()
    .required("Portfolio name is required.")
    .max(30, "Must be 30 characters or less."),
});

const CreatePortfolioForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, error, createPortfolio } = props;
  // purposely input dummy data

  const formComponent = (
    <Formik
      onSubmit={createPortfolio}
      initialValues={initialValues}
      schema={schema}
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
          <Form noValidate onSubmit={handleSubmit} className="my-2 w-50">
            <Form.Control
              className="my-1"
              type="text"
              name="newName"
              placeholder="Enter a new portfolio name"
              value={values.newName}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.newName && touched.newName}
              isValid={!errors.newName && touched.newName}
            />

            <Button type="submit" variant="outline-success">
              Change Portfolio
            </Button>
          </Form>
        );
      }}
    </Formik>
  );

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={loading} />
      <h5>Preparing rocket fuel...</h5>
    </div>
  );

  return loading ? loadingSpinnerComponent : formComponent;
};

const mapStateToProps = (state: any) => ({
  loading: state.portfolioReducer.createPortfolio.loading,
  error: state.portfolioReducer.createPortfolio.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createPortfolio: (formPayload: CreatePortfolioFormValues) => {
      dispatch(portfolioActions.createPortfolio(formPayload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePortfolioForm);
