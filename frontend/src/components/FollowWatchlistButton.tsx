import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import watchlistActions from "../redux/actions/watchlistActions";
import ClipLoader from "react-spinners/ClipLoader";

interface StateProps {
  addLoading: boolean;
  addError: string;
  deleteLoading: boolean;
  deleteError: string;
  following: string[];
  followingLoading: boolean;
}

interface DispatchProps {
  addFollowing: (watchlistID: string) => void;
  deleteFollowing: (watchlistID: string) => void;
  getFollowing: () => void;
}

interface Props {
  watchlistID: string;
}

const FollowWatchlistButton: React.FC<StateProps & DispatchProps & Props> = (
  props
) => {
  const {
    addLoading,
    deleteLoading,
    addFollowing,
    deleteFollowing,
    following,
    followingLoading,
    getFollowing,
    watchlistID,
  } = props;

  useEffect(() => {
    getFollowing();
  }, [getFollowing]);

  return followingLoading || addLoading || deleteLoading ? (
    <ClipLoader
      color={"green"}
      loading={followingLoading || addLoading || deleteLoading}
    />
  ) : following.includes(watchlistID) ? (
    <Button
      variant="primary"
      onClick={() => deleteFollowing(watchlistID)}
    >
      <FontAwesomeIcon className="mr-2" icon={faStar} />
      Unfollow Watchlist
    </Button>
  ) : (
    <Button onClick={() => addFollowing(watchlistID)}>
      <FontAwesomeIcon className="mr-2" icon={faStar} />
      Follow Watchlist
    </Button>
  );
};

const mapStateToProps = (state: any) => ({
  addLoading: state.watchlistReducer.addFollowing.loading,
  addError: state.watchlistReducer.addFollowing.error,
  deleteLoading: state.watchlistReducer.deleteFollowing.loading,
  deleteError: state.watchlistReducer.deleteFollowing.error,
  following: state.watchlistReducer.getFollowing.following,
  followingLoading: state.watchlistReducer.getFollowing.loading,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    addFollowing: (watchlistID: string) =>
      dispatch(watchlistActions.addFollowing({ watchlistID })),
    deleteFollowing: (watchlistID: string) =>
      dispatch(watchlistActions.deleteFollowing({ watchlistID })),
    getFollowing: () => dispatch(watchlistActions.getFollowing()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowWatchlistButton);
