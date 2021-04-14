import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DeleteCommentParams {
  commentID: string;
  parentID?: string;
}

interface StateProps {
  parentError: string;
  parentDeleting: string[];
  childError: string;
  childDeleting: string[];
}

interface DispatchProps {
  deleteParent: (payload: DeleteCommentParams) => void;
  deleteChild: (payload: DeleteCommentParams) => void;
}

interface Props {
  commentID: string;
  parentID?: string;
}

const DeleteCommentButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    parentDeleting,
    childDeleting,
    deleteParent,
    deleteChild,
    commentID,
    parentID,
  } = props;

  return parentDeleting.includes(commentID) ||
    childDeleting.includes(commentID) ? (
    <ClipLoader
      color={"green"}
      loading={
        parentDeleting.includes(commentID) || childDeleting.includes(commentID)
      }
    />
  ) : (
    <Button
      variant="light"
      onClick={() =>
        parentID
          ? deleteChild({ commentID, parentID })
          : deleteParent({ commentID })
      }
    >
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  parentError: state.forumReducer.deleteParent.error,
  parentDeleting: state.forumReducer.deleteParent.deleting,
  childError: state.forumReducer.deleteChild.error,
  childDeleting: state.forumReducer.deleteChild.deleting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteParent: (payload: DeleteCommentParams) => {
      dispatch(forumActions.deleteParent(payload));
    },
    deleteChild: (payload: DeleteCommentParams) => {
      dispatch(forumActions.deleteChild(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteCommentButton);
