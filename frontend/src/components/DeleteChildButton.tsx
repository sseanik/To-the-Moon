import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "react-bootstrap";

interface DeleteChildParams {
  commentID: string;
  parentID: string;
}

interface StateProps {
  error: string;
  deleting: Array<string>;
}

interface DispatchProps {
  deleteChild: (payload: DeleteChildParams) => void;
}

interface Props {
  commentID: string;
  parentID: string;
}

const DeleteChildButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { deleting, deleteChild, commentID, parentID } = props;

  return deleting.includes(commentID) ? (
    <ClipLoader color={"green"} loading={deleting.includes(commentID)} />
  ) : (
    <Button
      variant="light"
      onClick={() => deleteChild({ commentID, parentID })}
    >
      Delete
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  error: state.forumReducer.deleteChild.error,
  deleting: state.forumReducer.deleteChild.deleting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteChild: (payload: DeleteChildParams) => {
      dispatch(forumActions.deleteChild(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteChildButton);
