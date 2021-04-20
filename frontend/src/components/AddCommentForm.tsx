import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import * as Yup from "yup";
import { Formik } from "formik";
import { Alert, Button, Col, Form } from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";

interface AddCommentFormParams {
  stockTicker: string;
  timestamp: number;
  content: string;
  parentID?: string;
}

interface StateProps {
  parentError: string;
  parentLoading: boolean;
  childError: string;
  childAdding: string[];
}

interface DispatchProps {
  addParent: (payload: AddCommentFormParams) => void;
  addChild: (payload: AddCommentFormParams) => void;
}

interface Props {
  stockTicker: string;
  parentID?: string;
}

const schema = Yup.object({
  content: Yup.string()
    .required("Reply content is required.")
    .max(5000, "Reply cannot exceed 5000 characters"),
});

const AddChildForm: React.FC<StateProps & DispatchProps & Props> = (props) => {
  const {
    parentError,
    parentLoading,
    childError,
    childAdding,
    addParent,
    addChild,
    stockTicker,
    parentID,
  } = props;

  const initialValues: AddCommentFormParams = {
    stockTicker,
    timestamp: new Date().getTime(),
    content: "",
    parentID,
  };

  const formComponent = (
    <Formik
      onSubmit={parentID ? addChild : addParent}
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
            {parentError ? <Alert variant="danger">{parentError}</Alert> : null}
            {childError ? <Alert variant="danger">{childError}</Alert> : null}
            <Form.Row className="justify-content-between">
              <Col md={8}>
                <Form.Control
                  type="text"
                  name="content"
                  placeholder={parentID ? "Add a reply..." : "Add a comment..."}
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
                  variant="dark"
                  type="submit"
                  onClick={() => {
                    values.timestamp = new Date().getTime();
                  }}
                >
                  {parentID ? "Add Reply" : "Add Comment"}
                </Button>
              </Col>
            </Form.Row>
          </Form>
        );
      }}
    </Formik>
  );

  return parentLoading || (!!parentID && childAdding.includes(parentID)) ? (
    <ClipLoader
      color={"green"}
      loading={parentLoading || (!!parentID && childAdding.includes(parentID))}
    />
  ) : (
    formComponent
  );
};

const mapStateToProps = (state: any) => ({
  parentError: state.forumReducer.addParent.error,
  parentLoading: state.forumReducer.addParent.loading,
  childError: state.forumReducer.addChild.error,
  childAdding: state.forumReducer.addChild.adding,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    addParent: (payload: AddCommentFormParams) => {
      dispatch(forumActions.addParent(payload));
    },
    addChild: (payload: AddCommentFormParams) => {
      dispatch(forumActions.addChild(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddChildForm);
