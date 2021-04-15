import { useEffect } from "react";
import { Row, Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import WatchlistInfo from "../components/WatchlistInfo";
import watchlistActions from "../redux/actions/watchlistActions";
import ClipLoader from "react-spinners/ClipLoader";

interface WatchlistParams {
  watchlist_name: string;
  watchlist_id: string;
  author_username: string;
}

interface StateProps {
  watchlistLoading: boolean;
  watchlistError: string;
  watchlists: WatchlistParams[];
  followingLoading: boolean;
  followingError: string;
  following: string[];
  username: string;
}

interface DispatchProps {
  getWatchlists: () => void;
  getFollowing: () => void;
}

const WatchlistsPage: React.FC<StateProps & DispatchProps> = (props) => {
  const {
    watchlistLoading,
    watchlists,
    followingLoading,
    following,
    username,
    getWatchlists,
    getFollowing,
  } = props;

  useEffect(() => {
    getWatchlists();
  }, [getWatchlists]);

  useEffect(() => {
    getFollowing();
  }, [getFollowing]);

  return (
    <Tabs defaultActiveKey="following" className="justify-content-center">
      <Tab eventKey="following" title="Followed Watchlists">
        <Row className="my-2 justify-content-center">
          {watchlistLoading || followingLoading ? (
            <ClipLoader
              color={"green"}
              loading={watchlistLoading || followingLoading}
            />
          ) : (
            watchlists
              .filter((watchlistInfo: WatchlistParams) =>
                following.includes(watchlistInfo.watchlist_id)
              )
              .map((watchlistInfo: WatchlistParams, idx: number) => (
                <WatchlistInfo key={idx} {...watchlistInfo} />
              ))
          )}
        </Row>
      </Tab>
      <Tab eventKey="my" title="My Watchlists">
        <Row className="my-2 justify-content-center">
          {watchlistLoading ? (
            <ClipLoader color={"green"} loading={watchlistLoading} />
          ) : (
            watchlists
              .filter(
                (watchListInfo: WatchlistParams) =>
                  watchListInfo.author_username === username
              )
              .map((watchlistInfo: WatchlistParams, idx: number) => (
                <WatchlistInfo key={idx} {...watchlistInfo} />
              ))
          )}
        </Row>
      </Tab>
      <Tab eventKey="all" title="All Watchlists">
        <Row className="my-2 justify-content-center">
          {watchlistLoading ? (
            <ClipLoader color={"green"} loading={watchlistLoading} />
          ) : (
            watchlists.map((watchlistInfo: WatchlistParams, idx: number) => (
              <WatchlistInfo key={idx} {...watchlistInfo} />
            ))
          )}
        </Row>
      </Tab>
    </Tabs>
  );
};

const mapStateToProps = (state: any) => ({
  watchlistLoading: state.watchlistReducer.getWatchlists.loading,
  watchlistError: state.watchlistReducer.getWatchlists.error,
  watchlists: state.watchlistReducer.getWatchlists.watchlists,
  followingLoading: state.watchlistReducer.getFollowing.loading,
  followingError: state.watchlistReducer.getFollowing.error,
  following: state.watchlistReducer.getFollowing.following,
  username: state.userReducer.username,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getWatchlists: () => dispatch(watchlistActions.getWatchlists()),
    getFollowing: () => dispatch(watchlistActions.getFollowing()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistsPage);
