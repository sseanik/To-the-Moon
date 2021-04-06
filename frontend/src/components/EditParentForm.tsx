import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { Formik } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";

interface EditParentFormParams {
  commentID: string;
  timestamp: number;
  content: string;
}

interface StateProps {
  editing: Array<string>;
  error: string;
}

interface DispatchProps {
  editParent: (payload: EditParentFormParams) => void;
}

interface Props {
  commentID: string;
}

const schema = Yup.object({
  content: Yup.string()
    .required("Comment content is required.")
    .max(3000, "Comment cannot exceed 3000 characters"),
});

const EditParentForm: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { editing, error, editParent, commentID } = props;
  const initialValues: EditParentFormParams = {
    commentID,
    timestamp: new Date().getTime(),
    content: "",
  };

  const formComponent = (
    <Formik
      onSubmit={editParent}
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
  editing: state.forumReducer.editParent.editing,
  error: state.forumReducer.editParent.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    editParent: (payload: EditParentFormParams) => {
      dispatch(forumActions.editParent(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditParentForm);
