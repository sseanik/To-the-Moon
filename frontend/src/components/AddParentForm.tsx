import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

interface AddParentFormParams {
  stockTicker: string;
  timestamp: number;
  content: string;
}

interface StateProps {
  loading: boolean;
  error: string;
}

interface DispatchProps {
  addParent: (payload: AddParentFormParams) => void;
}

interface Props {
  stockTicker: string;
}

const initialValues: AddParentFormParams = {
  stockTicker: "",
  timestamp: new Date().getTime(),
  content: "",
};

const schema = Yup.object({
  content: Yup.string()
    .required("Comment content is required.")
    .max(3000, "Comment cannot exceed 3000 characters"),
});

const AddParentForm: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { loading, error, addParent, stockTicker } = props;
  initialValues.stockTicker = stockTicker;

  const formComponent = (
    <Formik
      onSubmit={addParent}
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
          <Form noValidate onSubmit={handleSubmit} className="w-100">
            {error ? <Alert variant="danger">{error}</Alert> : null}
            <Form.Row className="justify-content-between align-content-center">
              <Col md={8}>
                <Form.Control
                  type="text"
                  name="content"
                  placeholder="Your comment here"
                  value={values.content}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={!!errors.content && touched.content}
                />
                {errors.content ? (
                  <Form.Control.Feedback type="invalid">
                    {errors.content}
                  </Form.Control.Feedback>
                ) : null}
              </Col>

              <Col md={2}>
                <Button
                  variant="outline-primary"
                  type="submit"
                  onClick={() => {
                    values.timestamp = new Date().getTime();
                  }}
                >
                  Add Comment
                </Button>
              </Col>
            </Form.Row>
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
  loading: state.forumReducer.addParent.loading,
  error: state.forumReducer.addParent.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    addParent: (payload: AddParentFormParams) => {
      dispatch(forumActions.addParent(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddParentForm);
