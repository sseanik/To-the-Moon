import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import forumActions from "../redux/actions/forumActions";

interface UpvoteCommentParams {
  commentID: string;
  parentID?: string;
}

interface StateProps {
  parentUpvoting: string[];
  childUpvoting: string[];
  parentDownvoting: string[];
  childDownvoting: string[];
}

interface DispatchProps {
  upvoteParent: (payload: UpvoteCommentParams, remove: boolean) => void;
  upvoteChild: (payload: UpvoteCommentParams, remove: boolean) => void;
}

interface Props {
  commentID: string;
  parentID?: string;
  isUpvoted: boolean;
}

const UpvoteCommentButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    parentUpvoting,
    childUpvoting,
    parentDownvoting,
    childDownvoting,
    upvoteParent,
    upvoteChild,
    commentID,
    parentID,
    isUpvoted,
  } = props;

  return (
    <Button
      variant={isUpvoted ? "success" : "light"}
      onClick={() => {
        parentID
          ? upvoteChild({ commentID, parentID }, isUpvoted)
          : upvoteParent({ commentID }, isUpvoted);
      }}
      disabled={
        parentUpvoting.includes(commentID) ||
        childUpvoting.includes(commentID) ||
        parentDownvoting.includes(commentID) ||
        childDownvoting.includes(commentID)
      }
    >
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  parentUpvoting: state.forumReducer.upvoteParent.upvoting,
  childUpvoting: state.forumReducer.upvoteChild.upvoting,
  parentDownvoting: state.forumReducer.downvoteParent.downvoting,
  childDownvoting: state.forumReducer.downvoteChild.downvoting,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    upvoteParent: (payload: UpvoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeUpvoteParent(payload))
        : dispatch(forumActions.upvoteParent(payload));
    },
    upvoteChild: (payload: UpvoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeUpvoteChild(payload))
        : dispatch(forumActions.upvoteChild(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpvoteCommentButton);
