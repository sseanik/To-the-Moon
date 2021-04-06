import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

interface AddChildFormParams {
  stockTicker: string;
  timestamp: number;
  content: string;
  parentID: string;
}

interface StateProps {
  error: string;
  adding: Array<string>;
}

interface DispatchProps {
  addChild: (payload: AddChildFormParams) => void;
}

interface Props {
  stockTicker: string;
  parentID: string;
}

const schema = Yup.object({
  content: Yup.string()
    .required("Reply content is required.")
    .max(3000, "Reply cannot exceed 3000 characters"),
});

const AddChildForm: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { error, adding, addChild, stockTicker, parentID } = props;

  const initialValues: AddChildFormParams = {
    stockTicker,
    timestamp: new Date().getTime(),
    content: "",
    parentID,
  };

  const formComponent = (
    <Formik
      onSubmit={addChild}
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
          <Form noValidate onSubmit={handleSubmit} className="w-100 mt-2">
            {error ? <Alert variant="danger">{error}</Alert> : null}
            <Form.Row className="justify-content-between">
              <Col md={8}>
                <Form.Control
                  type="text"
                  name="content"
                  placeholder="Your reply here"
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
                  variant="outline-dark"
                  type="submit"
                  onClick={() => {
                    values.timestamp = new Date().getTime();
                  }}
                >
                  Add Reply
                </Button>
              </Col>
            </Form.Row>
          </Form>
        );
      }}
    </Formik>
  );

  return adding.includes(parentID) ? (
    <ClipLoader color={"green"} loading={adding.includes(parentID)} />
  ) : (
    formComponent
  );
};

const mapStateToProps = (state: any) => ({
  error: state.forumReducer.addChild.error,
  adding: state.forumReducer.addChild.adding,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    addChild: (payload: AddChildFormParams) => {
      dispatch(forumActions.addChild(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddChildForm);
