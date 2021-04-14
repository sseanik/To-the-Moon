import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";

interface DownvoteCommentParams {
  commentID: string;
  parentID?: string;
}

interface StateProps {
  parentError: string;
  parentDownvoting: string[];
  childError: string;
  childDownvoting: string[];
}

interface DispatchProps {
  downvoteParent: (payload: DownvoteCommentParams) => void;
  downvoteChild: (payload: DownvoteCommentParams) => void;
}

interface Props {
  commentID: string;
  parentID?: string;
  isDownvoted: boolean;
}

const DeleteCommentButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    parentDownvoting,
    childDownvoting,
    downvoteParent,
    downvoteChild,
    commentID,
    parentID,
    isDownvoted,
  } = props;

  const buttonComponent = isDownvoted ? (
    <Button variant="danger">
      <FontAwesomeIcon icon={faThumbsDown} />
    </Button>
  ) : (
    <Button
      variant="light"
      onClick={() =>
        parentID
          ? downvoteChild({ commentID, parentID })
          : downvoteParent({ commentID })
      }
    >
      <FontAwesomeIcon icon={faThumbsDown} />
    </Button>
  );

  return parentDownvoting.includes(commentID) ||
    childDownvoting.includes(commentID) ? (
    <Button variant="light" disabled>
      <FontAwesomeIcon icon={faThumbsDown} />
    </Button>
  ) : (
    buttonComponent
  );
};

const mapStateToProps = (state: any) => ({
  parentError: state.forumReducer.downvoteParent.error,
  parentDownvoting: state.forumReducer.downvoteParent.downvoting,
  childError: state.forumReducer.downvoteChild.error,
  childDownvoting: state.forumReducer.downvoteChild.downvoting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    downvoteParent: (payload: DownvoteCommentParams) => {
      dispatch(forumActions.downvoteParent(payload));
    },
    downvoteChild: (payload: DownvoteCommentParams) => {
      dispatch(forumActions.downvoteChild(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteCommentButton);
