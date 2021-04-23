import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import forumActions from "../redux/actions/forumActions";

interface DownvoteCommentParams {
  commentID: string;
  parentID?: string;
}

interface StateProps {
  parentDownvoting: string[];
  childDownvoting: string[];
  parentUpvoting: string[];
  childUpvoting: string[];
}

interface DispatchProps {
  downvoteParent: (payload: DownvoteCommentParams, remove: boolean) => void;
  downvoteChild: (payload: DownvoteCommentParams, remove: boolean) => void;
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
    parentUpvoting,
    childUpvoting,
    downvoteParent,
    downvoteChild,
    commentID,
    parentID,
    isDownvoted,
  } = props;

  return (
    <Button
      variant={isDownvoted ? "danger" : "light"}
      onClick={() => {
        parentID
          ? downvoteChild({ commentID, parentID }, isDownvoted)
          : downvoteParent({ commentID }, isDownvoted);
      }}
      disabled={
        parentDownvoting.includes(commentID) ||
        childDownvoting.includes(commentID) ||
        parentUpvoting.includes(commentID) ||
        childUpvoting.includes(commentID)
      }
    >
      <FontAwesomeIcon icon={faThumbsDown} />
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  parentDownvoting: state.forumReducer.downvoteParent.downvoting,
  childDownvoting: state.forumReducer.downvoteChild.downvoting,
  parentUpvoting: state.forumReducer.upvoteParent.upvoting,
  childUpvoting: state.forumReducer.upvoteChild.upvoting,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    downvoteParent: (payload: DownvoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeDownvoteParent(payload))
        : dispatch(forumActions.downvoteParent(payload));
    },
    downvoteChild: (payload: DownvoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeDownvoteChild(payload))
        : dispatch(forumActions.downvoteChild(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteCommentButton);
