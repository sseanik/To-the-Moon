import { useEffect } from "react";
import { Row, Tab, Tabs } from "react-bootstrap";
import { connect } from "react-redux";
import WatchlistInfo from "../components/WatchlistInfo";
import watchlistActions from "../redux/actions/watchlistActions";

interface WatchlistParams {
  watchlistName: string;
  watchlistID: string;
  author: string;
}

interface StateProps {
  watchlistLoading: boolean;
  watchlistError: string;
  watchlists: WatchlistParams[];
  followingLoading: boolean;
  followingError: string;
  following: WatchlistParams[];
  username: string;
}

interface DispatchProps {
  getWatchlists: () => void;
  getFollowing: () => void;
}

const WatchlistsPage: React.FC<StateProps & DispatchProps> = (props) => {
  const {
    watchlists,
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
          {following.map((watchlistInfo, idx) => (
            <WatchlistInfo key={idx} {...watchlistInfo} />
          ))}
        </Row>
      </Tab>
      <Tab eventKey="my" title="My Watchlists">
        <Row className="my-2 justify-content-center">
          {watchlists
            .filter(
              (watchListInfo: WatchlistParams) =>
                watchListInfo.author === username
            )
            .map((watchlistInfo, idx) => (
              <WatchlistInfo key={idx} {...watchlistInfo} />
            ))}
        </Row>
      </Tab>
      <Tab eventKey="all" title="All Watchlists">
        <Row className="my-2 justify-content-center">
          {watchlists.map((watchlistInfo, idx) => (
            <WatchlistInfo key={idx} {...watchlistInfo} />
          ))}
        </Row>
      </Tab>
    </Tabs>
  );
};

const mapStateToProps = (state: any) => ({
  watchlistLoading: state.watchlistReducer.getWatchlists.watchlists,
  watchlistError: state.watchlistReducer.getWatchlists.error,
  watchlists: state.watchlistReducer.getWatchlists.watchlists,
  followingLoading: state.watchlistReducer.getFollowing.following,
  followingError: state.watchlistReducer.getFollowing.error,
  following: state.watchlistReducer.getWatchlists.following,
  username: state.userReducer.username,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getWatchlists: () => dispatch(watchlistActions.getWatchlists()),
    getFollowing: () => dispatch(watchlistActions.getFollowing()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistsPage);
