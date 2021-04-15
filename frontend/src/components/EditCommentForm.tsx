import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { Formik } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";

interface EditCommentFormParams {
  commentID: string;
  timestamp: number;
  content: string;
  parentID?: string;
}

interface StateProps {
  parentEditing: string[];
  childEditing: string[];
  parentError: string;
  childError: string;
}

interface DispatchProps {
  editParent: (payload: EditCommentFormParams) => void;
  editChild: (payload: EditCommentFormParams) => void;
}

interface Props {
  commentID: string;
  parentID?: string;
}

const schema = Yup.object({
  content: Yup.string()
    .required("Comment content is required.")
    .max(5000, "Comment cannot exceed 5000 characters"),
});

const EditCommentForm: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    parentEditing,
    parentError,
    childEditing,
    childError,
    editParent,
    editChild,
    commentID,
    parentID,
  } = props;

  const initialValues: EditCommentFormParams = {
    commentID,
    timestamp: new Date().getTime(),
    content: "",
    parentID,
  };

  const formComponent = (
    <Formik
      onSubmit={parentID ? editChild : editParent}
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
          <Form noValidate onSubmit={handleSubmit} className="w-100 mt-2 ml-5">
            {parentError ? <Alert variant="danger">{parentError}</Alert> : null}
            {childError ? <Alert variant="danger">{childError}</Alert> : null}
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

  return parentEditing.includes(commentID) ||
    childEditing.includes(commentID) ? (
    <ClipLoader
      color={"green"}
      loading={
        parentEditing.includes(commentID) || childEditing.includes(commentID)
      }
    />
  ) : (
    formComponent
  );
};

const mapStateToProps = (state: any) => ({
  parentEditing: state.forumReducer.editParent.editing,
  parentError: state.forumReducer.editParent.error,
  childEditing: state.forumReducer.editChild.editing,
  childError: state.forumReducer.editChild.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    editParent: (payload: EditCommentFormParams) => {
      dispatch(forumActions.editParent(payload));
    },
    editChild: (payload: EditCommentFormParams) => {
      dispatch(forumActions.editChild(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCommentForm);
