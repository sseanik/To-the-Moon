import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import watchlistActions from "../redux/actions/watchlistActions";

interface StateProps {
  deleting: string[];
  error: string;
}

interface DispatchProps {
  deleteWatchlist: (watchlistID: string) => void;
}

interface Props {
  watchlistID: string;
}

const DeleteWatchlistButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const { deleting, deleteWatchlist, watchlistID } = props;
  return (
    <Button
      variant="danger"
      disabled={deleting.includes(watchlistID)}
      onClick={() => deleteWatchlist(watchlistID)}
    >
      <FontAwesomeIcon icon={faTrash} size="2x" />
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  deleting: state.watchlistReducer.deleteWatchlist.deleting,
  error: state.watchlistReducer.deleteWatchlist.error,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteWatchlist: (watchlistID: string) =>
      dispatch(watchlistActions.deleteWatchlist({ watchlistID })),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteWatchlistButton);
