import { useParams } from "react-router";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Formik } from "formik";
import * as Yup from "yup";
import stockAPI from "../api/investment";

interface Props {
  handleInvestmentAdded: () => void;
}

interface RouteMatchParams {
  name: string;
}

const schema = Yup.object({
  investmentSymbol: Yup.string()
    .required("Investment symbol is required.")
    .min(3, "Investment symbol must be at least 3 characters.")
    .max(5, "Investment symbol must be at most 5 characters"),
});

const AddInvestmentForm: React.FC<Props> = (props) => {
  const { handleInvestmentAdded } = props;
  const { name } = useParams<RouteMatchParams>();
  const [isLoading, setLoading] = useState(false);

  const onSuccess = (values: any) => {
    setLoading(true);
    const asyncAdd = async () => {
      await stockAPI.addStock(name, values.investmentSymbol);
      handleInvestmentAdded();
    };
    asyncAdd();
  };

  const loadingSpinnerComponent = (
    <div>
      <ClipLoader color={"green"} loading={isLoading} />
      <h5>Adding rocket fuel...</h5>
    </div>
  );

  const formComponent = (
    <Formik
      onSubmit={onSuccess}
      initialValues={{ investmentSymbol: "" }}
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
            <Form.Control
              type="text"
              id="investmentSymbol"
              name="investmentSymbol"
              placeholder="Enter an investment symbol"
              value={values.investmentSymbol}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.investmentSymbol && touched.investmentSymbol}
            />
            {errors.investmentSymbol ? (
              <Form.Control.Feedback type="invalid">
                {errors.investmentSymbol}
              </Form.Control.Feedback>
            ) : (
              <Form.Text className="text-muted">
                Invesment symbol must be offered.
              </Form.Text>
            )}

            <Button variant="primary" type="submit" className="my-2">
              Add Investment
            </Button>
          </Form>
        );
      }}
    </Formik>
  );

  return isLoading ? loadingSpinnerComponent : formComponent;
};

export default AddInvestmentForm;
