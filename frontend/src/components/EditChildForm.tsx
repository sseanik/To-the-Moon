import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { Formik } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";

interface EditChildFormParams {
  commentID: string;
  timestamp: number;
  content: string;
  parentID: string;
}

interface StateProps {
  editing: Array<string>;
  error: string;
}

interface DispatchProps {
  editChild: (payload: EditChildFormParams) => void;
}

interface Props {
  commentID: string;
  parentID: string;
}

const schema = Yup.object({
  content: Yup.string()
    .required("Comment content is required.")
    .max(3000, "Comment cannot exceed 3000 characters"),
});

const EditChildForm: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const { editing, error, editChild, commentID, parentID } = props;
  const initialValues: EditChildFormParams = {
    commentID,
    timestamp: new Date().getTime(),
    content: "",
    parentID,
  };

  const formComponent = (
    <Formik
      onSubmit={editChild}
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
                  variant="outline-dark"
                  type="submit"
                  onClick={() => {
                    values.timestamp = new Date().getTime();
                  }}
                >
                  Edit Comment
                </Button>
              </Col>
            </Form.Row>
          </Form>
        );
      }}
    </Formik>
  );

  return editing.includes(commentID) ? (
    <ClipLoader color={"green"} loading={editing.includes(commentID)} />
  ) : (
    formComponent
  );
};

const mapStateToProps = (state: any) => ({
  editing: state.forumReducer.editChild.editing,
  error: state.forumReducer.editChild.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    editChild: (payload: EditChildFormParams) => {
      dispatch(forumActions.editChild(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditChildForm);
