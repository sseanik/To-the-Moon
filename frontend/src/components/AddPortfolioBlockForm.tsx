import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import dashboardActions from "../redux/actions/dashboardActions";

interface AddPortfolioBlockFormValues {
  portfolio_name: string;
  detailed: boolean;
}

interface StateProps {
  dashboardId: string;
  loading: boolean;
}

interface DispatchProps {
  createBlock: (payload: CreateBlockParams) => void;
}

interface CreateBlockParams {
  dashboardId: string;
  type: string;
  meta: AddPortfolioBlockFormValues;
}

const initialValues: AddPortfolioBlockFormValues = {
  portfolio_name: "",
  detailed: false,
};

const schema = Yup.object({
  portfolio_name: Yup.string()
    .required("Portfolio is required.")
    .max(30, "Must be 30 characters or less."),
  detailed: Yup.bool().required("Required"),
});

const AddPortfolioBlockForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { dashboardId, loading, createBlock } = props;

  const handleFormSubmit = (values: AddPortfolioBlockFormValues) => {
    createBlock({ dashboardId, type: "portfolio", meta: values })
  }

  return (
    <Formik
      onSubmit={handleFormSubmit}
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
          <Form noValidate onSubmit={handleSubmit} className="my-5">
            <Form.Control
              className="my-1"
              type="text"
              name="portfolio_name"
              placeholder="Portfolio name"
              value={values.portfolio_name}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.portfolio_name && touched.portfolio_name}
              isValid={!errors.portfolio_name && touched.portfolio_name}
            />
            {errors.portfolio_name && touched.portfolio_name ? (
              <Form.Control.Feedback type="invalid">
                {errors.portfolio_name}
              </Form.Control.Feedback>
            ) : null}
            <Form.Check
              className="my-1"
              type="checkbox"
              name="detailed"
              label="Detailed"
              checked={values.detailed}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.detailed && touched.detailed}
              isValid={!errors.detailed && touched.detailed}
            />
            {errors.detailed && touched.detailed ? (
              <Form.Control.Feedback type="invalid">
                {errors.detailed}
              </Form.Control.Feedback>
            ) : null}
            <Button
              disabled={loading}
              className="w-100 my-1"
              variant="primary"
              type="submit"
            >
              {loading ? "Liquifying space food..." : "Add"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

const mapStateToProps = (state: any) => ({
  dashboardId: state.dashboardReducer.dashboardId,
  loading: state.dashboardReducer.createBlock.loading,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createBlock: (payload: CreateBlockParams) =>
      dispatch(dashboardActions.createBlock(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPortfolioBlockForm);
