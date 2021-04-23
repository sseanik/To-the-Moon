import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import forumActions from "../redux/actions/forumActions";

interface VoteCommentParams {
  commentID: string;
  parentID?: string;
}

interface StateProps {
  parentUpvoting: string[];
  childUpvoting: string[];
  parentDownvoting: string[];
  childDownvoting: string[];
  parentUpvoteRemoving: string[];
  childUpvoteRemoving: string[];
  parentDownvoteRemoving: string[];
  childDownvoteRemoving: string[];
}

interface DispatchProps {
  upvoteParent: (payload: VoteCommentParams, remove: boolean) => void;
  upvoteChild: (payload: VoteCommentParams, remove: boolean) => void;
  downvoteParent: (payload: VoteCommentParams, remove: boolean) => void;
  downvoteChild: (payload: VoteCommentParams, remove: boolean) => void;
}

interface Props {
  commentID: string;
  parentID?: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  voteType: "upvote" | "downvote";
}

const VoteCommentButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    parentUpvoting,
    childUpvoting,
    parentDownvoting,
    childDownvoting,
    parentUpvoteRemoving,
    childUpvoteRemoving,
    parentDownvoteRemoving,
    childDownvoteRemoving,
    upvoteParent,
    upvoteChild,
    downvoteParent,
    downvoteChild,
    commentID,
    parentID,
    isUpvoted,
    isDownvoted,
    voteType,
  } = props;

  return (
    <Button
      variant={
        voteType === "upvote"
          ? isUpvoted
            ? "success"
            : "light"
          : isDownvoted
          ? "danger"
          : "light"
      }
      onClick={() => {
        voteType === "upvote"
          ? parentID
            ? upvoteChild({ commentID, parentID }, isUpvoted)
            : upvoteParent({ commentID }, isUpvoted)
          : parentID
          ? downvoteChild({ commentID, parentID }, isDownvoted)
          : downvoteParent({ commentID }, isDownvoted);
      }}
      disabled={parentUpvoting
        .concat(
          childUpvoting,
          parentDownvoting,
          childDownvoting,
          parentUpvoteRemoving,
          childUpvoteRemoving,
          parentDownvoteRemoving,
          childDownvoteRemoving
        )
        .includes(commentID)}
    >
      <FontAwesomeIcon
        icon={voteType === "upvote" ? faThumbsUp : faThumbsDown}
      />
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  parentUpvoting: state.forumReducer.upvoteParent.upvoting,
  childUpvoting: state.forumReducer.upvoteChild.upvoting,
  parentDownvoting: state.forumReducer.downvoteParent.downvoting,
  childDownvoting: state.forumReducer.downvoteChild.downvoting,
  parentUpvoteRemoving: state.forumReducer.removeUpvoteParent.removing,
  childUpvoteRemoving: state.forumReducer.removeUpvoteChild.removing,
  parentDownvoteRemoving: state.forumReducer.removeDownvoteParent.removing,
  childDownvoteRemoving: state.forumReducer.removeDownvoteChild.removing,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    upvoteParent: (payload: VoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeUpvoteParent(payload))
        : dispatch(forumActions.upvoteParent(payload));
    },
    upvoteChild: (payload: VoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeUpvoteChild(payload))
        : dispatch(forumActions.upvoteChild(payload));
    },
    downvoteParent: (payload: VoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeDownvoteParent(payload))
        : dispatch(forumActions.downvoteParent(payload));
    },
    downvoteChild: (payload: VoteCommentParams, remove: boolean) => {
      remove
        ? dispatch(forumActions.removeDownvoteChild(payload))
        : dispatch(forumActions.downvoteChild(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteCommentButton);
