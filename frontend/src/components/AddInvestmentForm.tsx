import { useParams } from "react-router";
import { Alert, Button, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import { Formik } from "formik";
import * as Yup from "yup";
import investmentActions from "../redux/actions/investmentActions";
import { connect } from "react-redux";

interface RouteMatchParams {
  name: string;
}

interface AddInvestmentFormParams {
  portfolioName: string;
  stockTicker: string;
  numShares: number;
  purchaseDate: string;
  purchaseTime: string;
}

interface StateProps {
  loading: boolean;
  error: Object;
}

interface DispatchProps {
  createStock: (payload: AddInvestmentFormParams) => void;
}

const schema = Yup.object({
  stockTicker: Yup.string()
    .required("Investment symbol is required.")
    .min(3, "Investment symbol must be at least 3 characters.")
    .max(5, "Investment symbol must be at most 5 characters"),
});

const initialValues: AddInvestmentFormParams = {
  portfolioName: "",
  stockTicker: "",
  numShares: 1,
  purchaseDate: new Date().toLocaleDateString().split("/").reverse().join("-"),
  purchaseTime: new Date().toLocaleTimeString(),
};

const AddInvestmentForm: React.FC<StateProps & DispatchProps> = (props) => {
  const { loading, error, createStock } = props;
  const { name } = useParams<RouteMatchParams>();
  initialValues.portfolioName = name;

  const options = Array.from(Array(101).keys());
  options.shift();

  const formComponent = (
    <Formik
      onSubmit={createStock}
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
          <Form noValidate onSubmit={handleSubmit} className="my-2 w-100">
            {error ? <Alert variant="danger">{error}</Alert> : null}
            <Form.Label>Investment Symbol</Form.Label>
            <Form.Control
              type="text"
              name="stockTicker"
              placeholder="Enter an investment symbol"
              value={values.stockTicker}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.stockTicker && touched.stockTicker}
            />
            {errors.stockTicker ? (
              <Form.Control.Feedback type="invalid">
                {errors.stockTicker}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                Investment must be offered by To The Moon.
              </Form.Text>
            )}

            <Form.Label className="mt-2">Number of Shares</Form.Label>
            <Form.Control
              as="select"
              name="numShares"
              value={values.numShares}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.numShares && touched.numShares}
            >
              {options.map((number) => (
                <option key={number}>{number}</option>
              ))}
            </Form.Control>
            {errors.numShares ? (
              <Form.Control.Feedback type="invalid">
                {errors.numShares}
              </Form.Control.Feedback>
            ) : null}

            <Form.Label className="mt-2">Purchase Date</Form.Label>
            <Form.Control
              type="date"
              name="purchaseDate"
              value={values.purchaseDate}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.purchaseDate}
            />

            <Form.Label className="mt-2">Purchase Time</Form.Label>
            <Form.Control
              type="time"
              name="purchaseTime"
              value={values.purchaseTime}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.purchaseTime}
            />

            <Button variant="primary" type="submit" className="my-2">
              Add Investment
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
  loading: state.investmentReducer.createStock.loading,
  error: state.investmentReducer.createStock.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    createStock: (formPayload: AddInvestmentFormParams) => {
      dispatch(investmentActions.createStock(formPayload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddInvestmentForm);
