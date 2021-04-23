import { Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import dashboardActions from "../redux/actions/dashboardActions";

interface AddNewsBlockFormValues {
  stock_ticker: string;
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
  meta: AddNewsBlockFormValues;
}

const initialValues: AddNewsBlockFormValues = {
  stock_ticker: "",
};

const schema = Yup.object({
  stock_ticker: Yup.string()
    .required("Stock Symbols are required")
    .min(1, "Must be 1 character or more"),
});

const AddStockBlockForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { dashboardId, loading, createBlock } = props;

  const handleFormSubmit = (values: AddNewsBlockFormValues) => {
    createBlock({
      dashboardId,
      type: "stock",
      meta: values,
    });
  };

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
              name="stock_ticker"
              placeholder="Stock name"
              value={values.stock_ticker}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.stock_ticker && touched.stock_ticker}
              isValid={!errors.stock_ticker && touched.stock_ticker}
            />
            {errors.stock_ticker && touched.stock_ticker ? (
              <Form.Control.Feedback type="invalid">
                {errors.stock_ticker}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddStockBlockForm);
