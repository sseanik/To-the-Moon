import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";

interface UpvoteCommentParams {
  commentID: string;
  parentID?: string;
}

interface StateProps {
  parentError: string;
  parentUpvoting: string[];
  childError: string;
  childUpvoting: string[];
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
        parentUpvoting.includes(commentID) || childUpvoting.includes(commentID)
      }
    >
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  parentError: state.forumReducer.upvoteParent.error,
  parentUpvoting: state.forumReducer.upvoteParent.upvoting,
  childError: state.forumReducer.upvoteChild.error,
  childUpvoting: state.forumReducer.upvoteChild.upvoting,
});

const mapDispatchToProps = (dispatch: any) => {
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
