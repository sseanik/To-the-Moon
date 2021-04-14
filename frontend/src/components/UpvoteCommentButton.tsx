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
  upvoteParent: (payload: UpvoteCommentParams) => void;
  upvoteChild: (payload: UpvoteCommentParams) => void;
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

  const buttonComponent = isUpvoted ? (
    <Button variant="success">
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button>
  ) : (
    <Button
      variant="light"
      onClick={() =>
        parentID
          ? upvoteChild({ commentID, parentID })
          : upvoteParent({ commentID })
      }
    >
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button>
  );

  return parentUpvoting.includes(commentID) ||
    childUpvoting.includes(commentID) ? (
    <Button variant="light" disabled>
      <FontAwesomeIcon icon={faThumbsUp} />
    </Button>
  ) : (
    buttonComponent
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
    upvoteParent: (payload: UpvoteCommentParams) => {
      dispatch(forumActions.upvoteParent(payload));
    },
    upvoteChild: (payload: UpvoteCommentParams) => {
      dispatch(forumActions.upvoteChild(payload));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpvoteCommentButton);
