import { Button, Form } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";

export interface NoteFormValues {
  title: string;
  content: string;
  stockSymbols: string;
  portfolioNames: string;
  externalReferences: string;
  internalReferences: string;
}

interface Props {
  loading: boolean;
  initialValues: NoteFormValues;
  handleSubmit: (values: NoteFormValues) => void;
}

const schema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(1, "Must be 1 character or more")
    .max(300, "Must be 300 characters or less"),
  content: Yup.string()
    .required("Content is required")
    .min(1, "Must be 1 character or more")
    .max(5000, "Must be 5000 characters or less"),
  stockSymbols: Yup.string()
    .required("Stock Symbols are required")
    .min(1, "Must be 1 character or more"),
  portfolioNames: Yup.string().min(1, "Must be 1 character or more"),
  externalReferences: Yup.string().min(1, "Must be 1 character or more"),
  internalReferences: Yup.string().min(1, "Must be 1 character or more"),
});

const CreateEditNoteForm: React.FC<Props> = (props) => {
  const { loading, initialValues, handleSubmit } = props;

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
          <Form noValidate onSubmit={handleSubmit} className="my-2">
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                className="my-1"
                type="text"
                name="title"
                placeholder="Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.title && touched.title}
              />
              {errors.title && touched.title ? (
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                className="my-1"
                type="text"
                name="content"
                placeholder="Type some notes here..."
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.content && touched.content}
              />
              {errors.content && touched.content ? (
                <Form.Control.Feedback type="invalid">
                  {errors.content}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Linked Stocks</Form.Label>
              <Form.Control
                className="my-1"
                type="text"
                name="stockSymbols"
                placeholder="Separate with commas (e.g. AMZN,IBM)"
                value={values.stockSymbols}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.stockSymbols && touched.stockSymbols}
              />
              {errors.stockSymbols && touched.stockSymbols ? (
                <Form.Control.Feedback type="invalid">
                  {errors.stockSymbols}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Linked Portfolios</Form.Label>
              <Form.Control
                className="my-1"
                type="text"
                name="portfolioNames"
                placeholder="Separate with commas (e.g. US,Global)"
                value={values.portfolioNames}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={!!errors.portfolioNames && touched.portfolioNames}
              />
              {errors.portfolioNames && touched.portfolioNames ? (
                <Form.Control.Feedback type="invalid">
                  {errors.portfolioNames}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>External References</Form.Label>
              <Form.Control
                className="my-1"
                type="text"
                name="externalReferences"
                placeholder="Separate with commas"
                value={values.externalReferences}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={
                  !!errors.externalReferences && touched.externalReferences
                }
              />
              {errors.externalReferences && touched.externalReferences ? (
                <Form.Control.Feedback type="invalid">
                  {errors.externalReferences}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>
            <Form.Group>
              <Form.Label>Internal References</Form.Label>
              <Form.Control
                className="my-1"
                type="text"
                name="internalReferences"
                placeholder="Separate with commas"
                value={values.internalReferences}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={
                  !!errors.internalReferences && touched.internalReferences
                }
              />
              {errors.internalReferences && touched.internalReferences ? (
                <Form.Control.Feedback type="invalid">
                  {errors.internalReferences}
                </Form.Control.Feedback>
              ) : null}
            </Form.Group>

            <Button
              disabled={loading}
              className="w-100 my-1"
              variant="primary"
              type="submit"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateEditNoteForm;
