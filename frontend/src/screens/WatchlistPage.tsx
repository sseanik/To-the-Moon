import { useEffect } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router";
import watchlistActions from "../redux/actions/watchlistActions";
import ClipLoader from "react-spinners/ClipLoader";
import { Alert, Col, Container, Row } from "react-bootstrap";
import WatchlistStockInfo from "../components/WatchlistStockInfo";
import FollowWatchlistButton from "../components/FollowWatchlistButton";

interface RouteMatchParams {
  watchlistID: string;
}

interface StockParams {
  stock_ticker: string;
  proportion: number;
  price: number;
  price_change_percentage: number;
  volume: number;
  market_capitalization: number;
  PE_ratio: number;
}

interface WatchlistParams {
  watchlist_id: string;
  watchlist_name: string;
  author_username: string;
  description: string;
  stocks: StockParams[];
}

interface StateProps {
  loading: boolean;
  error: string;
  watchlist: WatchlistParams;
  username: string;
}

interface DispatchProps {
  getWatchlist: (watchlistID: string) => void;
}

const WatchlistPage: React.FC<StateProps & DispatchProps> = (props) => {
  const { watchlistID } = useParams<RouteMatchParams>();
  const { loading, error, watchlist, getWatchlist } = props;

  useEffect(() => {
    getWatchlist(watchlistID);
  }, [getWatchlist, watchlistID]);

  return loading ? (
    <ClipLoader color={"green"} loading={loading} />
  ) : (
    <Container fluid>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      <Row className="justify-content-center mt-3">
        <h1>{watchlist.watchlist_name}</h1>
      </Row>
      <Row className="justify-content-center">
        <p>
          Published by <b>{watchlist.author_username}</b>
        </p>
      </Row>
      <Row className="justify-content-center">{watchlist.description}</Row>
      <Row className="my-3">
        <Col>
          <FollowWatchlistButton watchlistID={watchlistID} />
        </Col>
      </Row>
      <Container className="bg-dark">
        <Row className="py-2 w-100 font-weight-bold">
          <Col>Stock Name</Col>
          <Col>Proportion</Col>
          <Col>Price</Col>
          <Col>Volume</Col>
          <Col>Market Cap</Col>
          <Col>PE Ratio</Col>
        </Row>
        <hr style={{ borderTop: "1px solid white" }} />
        {watchlist.stocks.map((stockProps: StockParams, idx: number) => (
          <div>
            <WatchlistStockInfo key={idx} {...stockProps} />
            <hr style={{ borderTop: "1px solid white" }} />
          </div>
        ))}
      </Container>
    </Container>
  );
};

const mapStateToProps = (state: any) => ({
  loading: state.watchlistReducer.getWatchlist.loading,
  error: state.watchlistReducer.getWatchlist.error,
  watchlist: state.watchlistReducer.getWatchlist.watchlist,
  username: state.userReducer.username,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    getWatchlist: (watchlistID: string) =>
      dispatch(watchlistActions.getWatchlist({ watchlistID })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WatchlistPage);
