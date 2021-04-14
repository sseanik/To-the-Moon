import { connect } from "react-redux";
import forumActions from "../redux/actions/forumActions";
import ClipLoader from "react-spinners/ClipLoader";
import { Button } from "react-bootstrap";

interface DeleteParentParams {
  commentID: string;
}

interface StateProps {
  error: string;
  deleting: Array<string>;
}

interface DispatchProps {
  deleteParent: (payload: DeleteParentParams) => void;
}

interface Props {
  commentID: string;
}

const DeleteParentButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { deleting, deleteParent, commentID } = props;

  return deleting.includes(commentID) ? (
    <ClipLoader color={"green"} loading={deleting.includes(commentID)} />
  ) : (
    <Button variant="light" onClick={() => deleteParent({ commentID })}>
      Delete
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  error: state.forumReducer.deleteParent.error,
  deleting: state.forumReducer.deleteParent.deleting,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteParent: (payload: DeleteParentParams) => {
      dispatch(forumActions.deleteParent(payload));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteParentButton);
