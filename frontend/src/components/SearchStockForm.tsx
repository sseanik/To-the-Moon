import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Formik } from "formik";

interface SearchStockFormValues {
  stock: string;
}

const initialValues = {
  stock: "",
}

const schema = Yup.object({
  stock: Yup.string()
    .required("Stock symbol is required.")
})

const SearchStockForm: React.FC = () => {
  const history = useHistory();

  const handleSubmit = (values: SearchStockFormValues) => {
    history.push(`/stock/${values.stock}`);
  }

  return (
    <Formik
      onSubmit={handleSubmit}
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
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicPassword">
              <Form.Control
                className="mr-sm-2"
                type="text"
                name="stock"
                placeholder="Enter a stock symbol..."
                value={values.stock}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.stock && touched.stock}
              />
              {errors.stock && touched.stock ? (
                <Form.Control.Feedback type="invalid">
                  {errors.stock}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Button disabled={!values.stock} size="lg" type="submit" variant="success">➱</Button>
          </Form>
        );
      }}
    </Formik>
  );
}

export default SearchStockForm;